package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Client.GeminiText.GeminiTextClient;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PredictionExplanationService {

    private final DiagnosisSimilarityResultService diagnosisSimilarityResultService;
    private final DiagnosisPredictedWorkService predictedWorkService;
    private final DiagnosisPredictedWorkPartService predictedWorkPartService;
    private final DiagnosisPredictionDefectService predictionDefectService;

    private final GeminiTextClient geminiTextClient;

    public String generateExplanation(PredictionContext context) {
        try {
            String prompt = buildPrompt(context);
            String explanation = geminiTextClient.generate(prompt);

            if (explanation == null || explanation.isBlank()) {
                log.warn("Gemini повернув порожнє пояснення прогнозу. Буде використано шаблонне пояснення.");
                return buildFallbackExplanation(context);
            }

            return explanation;
        } catch (RuntimeException ex) {
            log.warn(
                    "Не вдалося згенерувати пояснення прогнозу через Gemini. Буде використано шаблонне пояснення. Причина: {}",
                    ex.getMessage()
            );
            return buildFallbackExplanation(context);
        }
    }

    public PredictionContext build(DiagnosisPrediction prediction) {

        var claim = prediction.getDiagnosis().getClaim();

        return PredictionContext.builder()
                .equipmentModel(claim.getEquipment().getModel().getModelName())
                .claimDescription(claim.getDefectDescription())
                .similarCases(buildSimilarCases(prediction))
                .predictedDefects(buildDefects(prediction))
                .predictedWorks(buildWorks(prediction))
                .predictedTimeHours(prediction.getPredictedTimeHours())
                .predictedCost(prediction.getPredictedCost())
                .warrantyProbability(prediction.getPredictedWarrantyProbability())
                .confidenceScore(prediction.getConfidenceScore())
                .build();
    }

    private List<SimilarCaseContext> buildSimilarCases(DiagnosisPrediction prediction) {

        var results = diagnosisSimilarityResultService.getAllByPredictionId(prediction.getId());

        return results.stream()
                .limit(3)
                .map(r ->
                        SimilarCaseContext.builder()
                                .claimId(r.getClaim().getId())
                                .equipmentModel(r.getClaim().getEquipmentModel())
                                .defectDescription(r.getClaim().getDefectDescription())
                                .similarityScore(r.getSimilarityScore())
                                .build()
                )
                .toList();
    }

    private List<PredictedDefectContext> buildDefects(DiagnosisPrediction prediction) {

        var defects = predictionDefectService.getAllByPredictionId(prediction.getId());

        return defects.stream()
                .map(d ->
                        PredictedDefectContext.builder()
                                .name(d.getDefectCategory().getName())
                                .description(d.getDefectCategory().getDescription())
                                .probability(d.getProbabilityScore())
                                .build()
                )
                .toList();
    }

    private List<PredictedWorkContext> buildWorks(DiagnosisPrediction prediction) {

        var works = predictedWorkService.getAllByPredictionId(prediction.getId());
        var parts = predictedWorkPartService.getAllByPredictionId(prediction.getId());

        return works.stream()
                .map(work -> {
                    Integer repairWorkId = work.getRepairWork().getId();

                    var workParts = parts.stream()
                            .filter(part -> repairWorkId.equals(part.getRepairWorkId()))
                            .map(part -> PredictedWorkPartContext.builder()
                                    .partName(part.getPart().getPartName())
                                    .probability(part.getProbabilityScore())
                                    .predictedQuantity(part.getPredictedQuantity())
                                    .unitName(part.getPart().getUnitName())
                                    .repairWorkId(part.getRepairWorkId())
                                    .build())
                            .toList();

                    return PredictedWorkContext.builder()
                            .repairWorkId(repairWorkId)
                            .repairWorkName(work.getRepairWork().getName())
                            .probability(work.getProbabilityScore())
                            .estimatedTime(work.getPredictedTimeSpent())
                            .predictedParts(workParts)
                            .build();
                })
                .toList();
    }

    private String buildPrompt(PredictionContext ctx) {

        StringBuilder sb = new StringBuilder();

        sb.append("Ти є помічником сервісного інженера медичного обладнання.\n");
        sb.append("Твоє завдання — коротко пояснити прогноз DSS простими технічними словами.\n");
        sb.append("Пиши як пояснення до рекомендації, а не як фінальний діагноз.\n");
        sb.append("Не стверджуй, що причина несправності точно відома.\n");
        sb.append("Використовуй тільки надані нижче факти. Не вигадуй нові причини, симптоми, деталі ремонту або запчастини.\n");
        sb.append("Не пиши загальні фрази типу «система провела глибокий аналіз», «виявлені закономірності» без конкретного пояснення.\n");
        sb.append("Якщо опис несправності занадто загальний, прямо зазнач, що прогноз базується переважно на схожих історичних заявках.\n");
        sb.append("Не пояснюй походження слабких прогнозів, якщо для них немає явного звʼязку зі схожими випадками.\n");
        sb.append("Коли посилаєшся на історичні випадки, використовуй формат «кейс №ID», якщо ID доступний.\n");
        sb.append("Не пиши розмиті формулювання типу «перший випадок» без ідентифікатора кейсу.\n");
        sb.append("Відповідь має бути українською мовою, короткою, структурованою і практичною для інженера.\n");
        sb.append("Не використовуй markdown-розмітку: не використовуй **, *, #, таблиці або markdown-заголовки.\n");
        sb.append("Для структури використовуй звичайні назви секцій без спеціальних символів.\n");
        sb.append("Для переліків використовуй короткі речення з нового рядка або нумерацію 1), 2), 3), без символу *.\n");
        sb.append("Можна використовувати короткі абзаци з назвами секцій.\n\n");

        sb.append("Дані для пояснення прогнозу:\n\n");

        sb.append("Модель обладнання:\n");
        sb.append(formatText(ctx.getEquipmentModel())).append("\n\n");

        sb.append("Опис несправності з заявки:\n");
        sb.append(formatText(ctx.getClaimDescription())).append("\n\n");

        sb.append("Схожі історичні випадки ремонту:\n");

        if (ctx.getSimilarCases() == null || ctx.getSimilarCases().isEmpty()) {
            sb.append("Схожі випадки не знайдені або не пройшли поріг схожості.\n");
        } else {
            int i = 1;
            for (var c : ctx.getSimilarCases()) {
                sb.append(i++).append(". ");
                sb.append("Кейс №")
                        .append(c.getClaimId())
                        .append(" – ");
                sb.append(formatText(c.getEquipmentModel()))
                        .append(": ");
                sb.append(formatText(c.getDefectDescription()));
                sb.append(" (схожість ")
                        .append(formatPercent(c.getSimilarityScore()))
                        .append(")\n");
            }
        }

        sb.append("\nПрогнозовані категорії дефектів:\n");

        if (ctx.getPredictedDefects() == null || ctx.getPredictedDefects().isEmpty()) {
            sb.append("Прогнозовані категорії дефектів не визначені.\n");
        } else {
            for (var d : ctx.getPredictedDefects()) {
                sb.append("- ")
                        .append(formatText(d.getName()))
                        .append(" (ймовірність ")
                        .append(formatPercent(d.getProbability()))
                        .append(")");

                if (d.getDescription() != null && !d.getDescription().isBlank()) {
                    sb.append(": ")
                            .append(d.getDescription());
                }

                sb.append("\n");
            }
        }

        sb.append("\nПрогнозовані ремонтні роботи та повʼязані запчастини:\n");

        if (ctx.getPredictedWorks() == null || ctx.getPredictedWorks().isEmpty()) {
            sb.append("Прогнозовані ремонтні роботи не визначені.\n");
        } else {
            for (var work : ctx.getPredictedWorks()) {
                sb.append("- ")
                        .append(formatText(work.getRepairWorkName()))
                        .append(" (ймовірність ")
                        .append(formatPercent(work.getProbability()))
                        .append(", очікуваний час ")
                        .append(formatNumber(work.getEstimatedTime()))
                        .append(" год)\n");

                if (work.getPredictedParts() == null || work.getPredictedParts().isEmpty()) {
                    sb.append("  Запчастини: не визначені.\n");
                } else {
                    sb.append("  Запчастини:\n");

                    for (var part : work.getPredictedParts()) {
                        sb.append("  - ")
                                .append(formatText(part.getPartName()))
                                .append(" (кількість ")
                                .append(formatNumber(part.getPredictedQuantity()))
                                .append(" ")
                                .append(formatText(part.getUnitName()))
                                .append(", ймовірність ")
                                .append(formatPercent(part.getProbability()))
                                .append(")\n");
                    }
                }
            }
        }

        sb.append("\nПідсумкові оцінки прогнозу:\n");
        sb.append("Орієнтовний час ремонту: ")
                .append(formatNumber(ctx.getPredictedTimeHours()))
                .append(" год\n");

        sb.append("Орієнтовна вартість ремонту: ")
                .append(formatNumber(ctx.getPredictedCost()))
                .append("\n");

        sb.append("Ймовірність гарантійного ремонту: ")
                .append(formatPercent(ctx.getWarrantyProbability()))
                .append("\n");

        sb.append("Рівень впевненості прогнозу: ")
                .append(formatPercent(ctx.getConfidenceScore()))
                .append("\n\n");

        sb.append("Сформуй відповідь за такою структурою:\n");
        sb.append("1. Коротко поясни, на чому базується прогноз.\n");
        sb.append("2. Назви 2-3 найважливіші історичні кейси у форматі «кейс №ID» і коротко поясни, чим вони схожі.\n");
        sb.append("3. Поясни, чому система рекомендує саме ці основні категорії дефектів.\n");
        sb.append("4. Поясни, які ремонтні роботи та запчастини варто перевірити першими.\n");
        sb.append("5. Заверши попередженням, що прогноз попередній і має бути перевірений інженером.\n\n");

        sb.append("Вимоги до стилю відповіді:\n");
        sb.append("- не більше 4-6 коротких абзаців;\n");
        sb.append("- без довгих вступів;\n");
        sb.append("- без повторення всіх чисел підряд;\n");
        sb.append("- використовуй тільки найважливіші ймовірності та схожості;\n");
        sb.append("- якщо є слабкі прогнози з низькою ймовірністю, згадай їх тільки як додаткові можливі напрямки перевірки;\n");
        sb.append("- не роби остаточний висновок замість інженера.\n");

        return sb.toString();
    }

    private String buildFallbackExplanation(PredictionContext ctx) {

        StringBuilder sb = new StringBuilder();

        sb.append("Автоматичне пояснення прогнозу");
        sb.append("\n\n");

        sb.append("Система сформувала прогноз на основі аналізу схожих історичних заявок.");
        sb.append("\n");
        sb.append("Обладнання: ")
                .append(formatText(ctx.getEquipmentModel()))
                .append(".");
        sb.append("\n");
        sb.append("Опис несправності: ")
                .append(formatText(ctx.getClaimDescription()))
                .append(".");

        sb.append("\n\n");

        sb.append("Схожі історичні випадки:");
        sb.append("\n");
        if (ctx.getSimilarCases() == null || ctx.getSimilarCases().isEmpty()) {
            sb.append("Не знайдені або не пройшли поріг схожості.");
        } else {
            sb.append(joinSimilarCases(ctx.getSimilarCases()));
        }

        sb.append("\n\n");

        sb.append("Прогнозовані категорії дефектів:");
        sb.append("\n");
        if (ctx.getPredictedDefects() == null || ctx.getPredictedDefects().isEmpty()) {
            sb.append("Не визначені.");
        } else {
            sb.append(joinDefects(ctx.getPredictedDefects()));
        }

        sb.append("\n\n");

        sb.append("Рекомендовані ремонтні роботи та пов'язані запчастини:");
        sb.append("\n");
        if (ctx.getPredictedWorks() == null || ctx.getPredictedWorks().isEmpty()) {
            sb.append("Не визначені.");
        } else {
            sb.append(joinWorks(ctx.getPredictedWorks()));
        }

        sb.append("\n\n");

        sb.append("Підсумкова оцінка:");
        sb.append("\n");
        sb.append("Орієнтовний час ремонту: ")
                .append(formatNumber(ctx.getPredictedTimeHours()))
                .append(" год.");
        sb.append("\n");
        sb.append("Орієнтовна вартість ремонту: ")
                .append(formatNumber(ctx.getPredictedCost()))
                .append(".");
        sb.append("\n");
        sb.append("Ймовірність гарантійного ремонту: ")
                .append(formatPercent(ctx.getWarrantyProbability()))
                .append(".");
        sb.append("\n");
        sb.append("Рівень впевненості: ")
                .append(formatPercent(ctx.getConfidenceScore()))
                .append(".");

        sb.append("\n\n");

        sb.append("Рівень впевненості базується на схожості знайдених історичних випадків. ");
        sb.append("Прогноз потрібно перевірити інженеру перед підтвердженням діагностики.");

        sb.append("\n\n");

        sb.append("Це пояснення сформовано за шаблоном, оскільки LLM-сервіс тимчасово недоступний.");

        return sb.toString();
    }

    private String joinSimilarCases(List<SimilarCaseContext> similarCases) {

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < similarCases.size(); i++) {
            var similarCase = similarCases.get(i);

            sb.append(i + 1)
                    .append(". ")
                    .append("Кейс №")
                    .append(similarCase.getClaimId())
                    .append(" – ")
                    .append(formatText(similarCase.getEquipmentModel()))
                    .append(": ")
                    .append(formatText(similarCase.getDefectDescription()))
                    .append(" (схожість ")
                    .append(formatPercent(similarCase.getSimilarityScore()))
                    .append(")");

            if (i < similarCases.size() - 1) {
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private String joinDefects(List<PredictedDefectContext> defects) {

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < defects.size(); i++) {
            var defect = defects.get(i);

            sb.append(i + 1)
                    .append(". ")
                    .append(formatText(defect.getName()))
                    .append(" – ")
                    .append(formatPercent(defect.getProbability()));

            if (i < defects.size() - 1) {
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private String joinWorks(List<PredictedWorkContext> works) {

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < works.size(); i++) {
            var work = works.get(i);

            sb.append(i + 1)
                    .append(". ")
                    .append(formatText(work.getRepairWorkName()))
                    .append(" – ймовірність ")
                    .append(formatPercent(work.getProbability()))
                    .append(", очікуваний час ")
                    .append(formatNumber(work.getEstimatedTime()))
                    .append(" год");

            var parts = work.getPredictedParts();

            if (parts == null || parts.isEmpty()) {
                sb.append("\n")
                        .append("   Запчастини: не визначені.");
            } else {
                sb.append("\n")
                        .append("   Запчастини:");

                for (var part : parts) {
                    sb.append("\n")
                            .append("   - ")
                            .append(formatText(part.getPartName()))
                            .append(" – кількість ")
                            .append(formatNumber(part.getPredictedQuantity()))
                            .append(" ")
                            .append(formatText(part.getUnitName()))
                            .append(", ймовірність ")
                            .append(formatPercent(part.getProbability()));
                }
            }

            if (i < works.size() - 1) {
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    private String formatPercent(BigDecimal value) {

        if (value == null) {
            return "не визначено";
        }

        return value
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP)
                .stripTrailingZeros()
                .toPlainString() + "%";
    }

    private String formatNumber(BigDecimal value) {

        if (value == null) {
            return "не визначено";
        }

        return value
                .stripTrailingZeros()
                .toPlainString();
    }

    private String formatText(String value) {
        if (value == null || value.isBlank()) {
            return "не визначено";
        }

        return value;
    }
}
