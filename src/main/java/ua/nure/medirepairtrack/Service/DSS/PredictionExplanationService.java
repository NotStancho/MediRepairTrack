package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ua.nure.medirepairtrack.Client.GeminiText.GeminiTextClient;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Service.ClaimService;
import ua.nure.medirepairtrack.Service.PartService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionExplanationService {

    private final DiagnosisSimilarityResultService diagnosisSimilarityResultService;
    private final DiagnosisPredictedPartService predictedPartService;
    private final DiagnosisPredictedOperationService predictedOperationService;
    private final DiagnosisPredictionDefectService predictionDefectService;

    private final ClaimService claimService;
    private final PartService partService;

    private final GeminiTextClient geminiTextClient;

    public String generateExplanation(PredictionContext context) {

        String prompt = buildPrompt(context);

        return geminiTextClient.generate(prompt);
    }

    public PredictionContext build(DiagnosisPrediction prediction) {

        var claim = prediction.getDiagnosis().getClaim();

        return PredictionContext.builder()
                .equipmentModel(claim.getEquipment().getModel().getModelName())
                .claimDescription(claim.getDefectDescription())
                .similarCases(buildSimilarCases(prediction))
                .predictedDefects(buildDefects(prediction))
                .predictedOperations(buildOperations(prediction))
                .predictedParts(buildParts(prediction))
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
                .map(r -> {

                    var claim = claimService.getClaim(r.getClaimId());

                    return SimilarCaseContext.builder()
                            .equipmentModel(claim.getEquipment().getModel().getModelName())
                            .defectDescription(claim.getDefectDescription())
                            .similarityScore(r.getSimilarityScore())
                            .build();
                })
                .toList();
    }

    private List<PredictedDefectContext> buildDefects(DiagnosisPrediction prediction) {

        var defects = predictionDefectService.getByPrediction(prediction.getId());

        return defects.stream()
                .map(d -> {

                    var defect = d.getDefectCategory();

                    return PredictedDefectContext.builder()
                            .name(defect.getName())
                            .description(defect.getDescription())
                            .probability(d.getProbabilityScore())
                            .build();
                })
                .toList();
    }

    private List<PredictedOperationContext> buildOperations(DiagnosisPrediction prediction) {

        var operations = predictedOperationService.getByPrediction(prediction.getId());

        return operations.stream()
                .map(o -> {

                    var operation = o.getOperation();

                    return PredictedOperationContext.builder()
                            .operationName(operation.getName())
                            .probability(o.getProbabilityScore())
                            .estimatedTime(o.getPredictedTimeSpent())
                            .build();
                })
                .toList();
    }

    private List<PredictedPartContext> buildParts(DiagnosisPrediction prediction) {

        var parts = predictedPartService.getAllByPredictionId(prediction.getId());

        return parts.stream()
                .map(p -> {

                    var part = partService.getPartEntity(p.getPartId());

                    return PredictedPartContext.builder()
                            .partName(part.getPartName())
                            .probability(p.getProbabilityScore())
                            .build();
                })
                .toList();
    }

    private String buildPrompt(PredictionContext ctx) {

        StringBuilder sb = new StringBuilder();

        sb.append("Ти є інтелектуальним помічником, який допомагає інженерам аналізувати несправності медичного обладнання.\n");
        sb.append("На основі наданих даних поясни, чому система сформувала такий прогноз діагностики.\n");
        sb.append("Не використовуй markdown, форматування або списки.\n\n");
        sb.append("Не вигадуй нові факти та використовуй тільки інформацію, наведену нижче.\n\n");

        sb.append("Модель обладнання:\n");
        sb.append(ctx.getEquipmentModel()).append("\n\n");

        sb.append("Опис несправності (заявка клієнта):\n");
        sb.append(ctx.getClaimDescription()).append("\n\n");

        sb.append("Схожі історичні випадки ремонту:\n");

        int i = 1;
        for (var c : ctx.getSimilarCases()) {

            sb.append(i++).append(". ");
            sb.append(c.getDefectDescription());
            sb.append(" (схожість ").append(c.getSimilarityScore()).append(")\n");
        }

        sb.append("\nПрогнозовані категорії дефектів:\n");

        for (var d : ctx.getPredictedDefects()) {

            sb.append("- ")
                    .append(d.getName())
                    .append(" (ймовірність ")
                    .append(d.getProbability())
                    .append(")\n");
        }

        sb.append("\nПрогнозовані ремонтні операції:\n");

        for (var o : ctx.getPredictedOperations()) {

            sb.append("- ")
                    .append(o.getOperationName())
                    .append(" (ймовірність ")
                    .append(o.getProbability())
                    .append(", час ")
                    .append(o.getEstimatedTime())
                    .append(" год)\n");
        }

        sb.append("\nПрогнозовані необхідні запчастини:\n");

        for (var p : ctx.getPredictedParts()) {

            sb.append("- ")
                    .append(p.getPartName())
                    .append(" (ймовірність ")
                    .append(p.getProbability())
                    .append(")\n");
        }

        sb.append("\nОцінений час ремонту: ")
                .append(ctx.getPredictedTimeHours())
                .append(" год");

        sb.append("\nОцінена вартість ремонту: ")
                .append(ctx.getPredictedCost());

        sb.append("\nЙмовірність гарантійного ремонту: ")
                .append(ctx.getWarrantyProbability());

        sb.append("\nРівень впевненості прогнозу: ")
                .append(ctx.getConfidenceScore());

        sb.append("\n\nСформулюй пояснення, чому система зробила саме такий прогноз.");
        sb.append("\nПояснення має базуватися на схожих випадках ремонту та виявлених закономірностях.");

        return sb.toString();
    }
}
