package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarityDTO.SimilarityResultResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.PredictedWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictionContext;
import ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO.PricingConfigResponseDTO;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimService;
import ua.nure.medirepairtrack.Service.billing.PricingConfigService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PredictionAggregationService {

    private final PredictionDemoDelayService demoDelayService;

    private final DiagnosisSimilarityResultService similarityResultService;
    private final DiagnosisPredictedWorkService predictedWorkService;
    private final DiagnosisPredictedWorkPartService predictedWorkPartService;
    private final DiagnosisPredictionDefectService predictedDefectService;
    private final PredictionExplanationService explanationService;

    private final ClaimService claimService;
    private final PricingConfigService pricingConfigService;
    private final ComplexityLevelService complexityLevelService;

    private final DiagnosisPredictionRepository diagnosisPredictionRepository;

    private final DiagnosisPermissionService permissionService;
    private final DiagnosisPredictionJobService predictionJobService;

    @Transactional
    public void generatePredictionData(DiagnosisPrediction prediction) {
        Integer diagnosisId = prediction.getDiagnosis().getId();

        demoDelayService.waitIfEnabled();
        // 1. similarity search
        predictionJobService.running(diagnosisId, 40, "SIMILARITY_SEARCH",
                "Підбираємо схожі історичні заявки для порівняння."
        );
        demoDelayService.waitIfEnabled();
        similarityResultService.generateSimilarityResults(prediction);
        predictionJobService.running(diagnosisId, 50, "SIMILARITY_READY",
                "Схожі заявки опрацьовано. Формуємо рекомендовані роботи."
        );
        demoDelayService.waitIfEnabled();
        // 2. predicted entities
        predictedWorkService.generatePredictedWorks(prediction);
        predictionJobService.running(diagnosisId, 60, "WORKS_READY",
                "Рекомендовані ремонтні роботи сформовано. Прогнозуємо потрібні запчастини."
        );
        demoDelayService.waitIfEnabled();
        predictedWorkPartService.generatePredictedWorkParts(prediction);
        predictionJobService.running(diagnosisId, 70, "PARTS_READY",
                "Потрібні запчастини спрогнозовано. Визначаємо ймовірні категорії дефектів."
        );
        demoDelayService.waitIfEnabled();
        predictedDefectService.generatePredictedDefects(prediction);
        predictionJobService.running(diagnosisId, 78, "DEFECTS_READY",
                "Ймовірні категорії дефектів сформовано. Розраховуємо підсумкові оцінки."
        );
        demoDelayService.waitIfEnabled();

        // 3. aggregated metrics
        calculatePredictedTimeHours(prediction);

        var similarityResults = similarityResultService.getAllByPredictionId(prediction.getId());

        calculatePredictedCost(prediction);
        calculateWarrantyProbability(prediction, similarityResults);
        calculateConfidenceScore(prediction, similarityResults);
        predictionJobService.running(diagnosisId, 86, "METRICS_READY",
                "Оцінку часу, вартості та впевненості розраховано. Визначаємо складність ремонту."
        );
        demoDelayService.waitIfEnabled();
        // 4. rule-based complexity
        calculatePredictedComplexityLevel(prediction);
        predictionJobService.running(diagnosisId, 92, "COMPLEXITY_READY",
                "Складність ремонту визначено. Готуємо пояснення прогнозу для інженера."
        );
        demoDelayService.waitIfEnabled();

        // 5. explanation (LLM)
        PredictionContext context = explanationService.build(prediction);

        String explanation = explanationService.generateExplanation(context);

        prediction.setPredictionExplanation(explanation);
        predictionJobService.running(diagnosisId, 96, "EXPLANATION_READY",
                "Пояснення прогнозу підготовлено. Завершуємо оновлення діагностики."
        );
        demoDelayService.waitIfEnabled();
    }

    @Transactional
    public void calculatePredictedTimeHours(DiagnosisPrediction prediction) {

        var works = predictedWorkService.getAllByPredictionId(prediction.getId());

        if (works.isEmpty()) {
            prediction.setPredictedTimeHours(BigDecimal.ZERO);
            return;
        }

        BigDecimal totalTime = works.stream()
                .map(PredictedWorkResponseDTO::getPredictedTimeSpent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        prediction.setPredictedTimeHours(
                totalTime.setScale(2, RoundingMode.HALF_UP)
        );
    }

    @Transactional
    public void calculatePredictedCost(DiagnosisPrediction prediction) {
        RepairType repairType = prediction.getDiagnosis()
                .getClaim()
                .getRepairType();

        // Якщо тип ремонту ще не визначено, DSS використовує тариф післягарантійного ремонту
        // як fallback для попередньої оцінки вартості.
        if (repairType == RepairType.WAITING_DECISION) {
            repairType = RepairType.POST_WARRANTY_REPAIR;
        }

        PricingConfigResponseDTO config = pricingConfigService.getByRepairType(repairType);

        BigDecimal predictedHours = Optional
                .ofNullable(prediction.getPredictedTimeHours())
                .orElse(BigDecimal.ZERO);

        if (config.getLaborMinHours() != null && predictedHours.compareTo(config.getLaborMinHours()) < 0) {
            predictedHours = config.getLaborMinHours();
        }

        BigDecimal laborCost = predictedHours.multiply(config.getLaborPricePerHour());

        var predictedWorkParts = predictedWorkPartService.getAllByPredictionId(prediction.getId());

        BigDecimal partsCost = predictedWorkParts.stream()
                .map(p ->
                        p.getPart().getPrice()
                                .multiply(p.getPredictedQuantity())
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        partsCost = partsCost
                .multiply(config.getPartsCoefficient());

        BigDecimal totalCost = laborCost.add(partsCost);

        prediction.setPredictedCost(
                totalCost.setScale(2, RoundingMode.HALF_UP)
        );
    }

    @Transactional
    public void calculateWarrantyProbability(DiagnosisPrediction prediction, List<SimilarityResultResponseDTO> similarityResults) {
        if (similarityResults.isEmpty()) {
            prediction.setPredictedWarrantyProbability(BigDecimal.ZERO);
            return;
        }

        double weightedWarranty = 0;
        double totalSimilarity = 0;

        for (var result : similarityResults) {

            double similarity = result.getSimilarityScore().doubleValue();

            var claim = claimService.getClaim(result.getClaim().getId());

            if (claim.getRepairType() == RepairType.WARRANTY_REPAIR) {
                weightedWarranty += similarity;
            }

            totalSimilarity += similarity;
        }

        if (totalSimilarity == 0) {
            prediction.setPredictedWarrantyProbability(BigDecimal.ZERO);
            return;
        }

        double probability = weightedWarranty / totalSimilarity;

        prediction.setPredictedWarrantyProbability(
                BigDecimal.valueOf(probability).setScale(4, RoundingMode.HALF_UP)
        );
    }

    @Transactional
    public void calculateConfidenceScore(DiagnosisPrediction prediction, List<SimilarityResultResponseDTO> similarityResults) {

        if (similarityResults.isEmpty()) {
            prediction.setConfidenceScore(BigDecimal.ZERO);
            return;
        }

        double avgSimilarity = similarityResults.stream()
                .mapToDouble(r -> r.getSimilarityScore().doubleValue())
                .average()
                .orElse(0);

        prediction.setConfidenceScore(
                BigDecimal.valueOf(avgSimilarity).setScale(4, RoundingMode.HALF_UP)
        );
    }

    @Transactional
    public void calculatePredictedComplexityLevel(DiagnosisPrediction prediction) {

        int complexityScore = 0;

        BigDecimal predictedHours = Optional
                .ofNullable(prediction.getPredictedTimeHours())
                .orElse(BigDecimal.ZERO);

        BigDecimal predictedCost = Optional
                .ofNullable(prediction.getPredictedCost())
                .orElse(BigDecimal.ZERO);

        BigDecimal confidence = Optional
                .ofNullable(prediction.getConfidenceScore())
                .orElse(BigDecimal.ZERO);

        int worksCount = predictedWorkService.getAllByPredictionId(prediction.getId()).size();
        int partsCount = predictedWorkPartService.getAllByPredictionId(prediction.getId()).size();

        if (predictedHours.compareTo(BigDecimal.valueOf(6)) >= 0) {
            complexityScore += 3;
        } else if (predictedHours.compareTo(BigDecimal.valueOf(3)) >= 0) {
            complexityScore += 2;
        } else if (predictedHours.compareTo(BigDecimal.valueOf(1)) >= 0) {
            complexityScore += 1;
        }

        if (worksCount >= 5) {
            complexityScore += 2;
        } else if (worksCount >= 3) {
            complexityScore += 1;
        }

        if (partsCount >= 4) {
            complexityScore += 2;
        } else if (partsCount >= 2) {
            complexityScore += 1;
        }

        if (predictedCost.compareTo(BigDecimal.valueOf(10000)) >= 0) {
            complexityScore += 2;
        } else if (predictedCost.compareTo(BigDecimal.valueOf(3000)) >= 0) {
            complexityScore += 1;
        }

        if (confidence.compareTo(BigDecimal.valueOf(0.50)) < 0) {
            complexityScore += 1;
        }

        int complexityId;
        if (complexityScore <= 1) {
            complexityId = 1; // LOW
        } else if (complexityScore <= 3) {
            complexityId = 2; // MEDIUM
        } else if (complexityScore <= 6) {
            complexityId = 3; // HIGH
        } else {
            complexityId = 4; // CRITICAL
        }

        prediction.setPredictedComplexityLevel(complexityLevelService.getEntity(complexityId));
    }

    @Transactional
    public void recalculate(Integer predictionId) {
        DiagnosisPrediction prediction = diagnosisPredictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        if (prediction.getPredictionSource() == PredictionSource.AUTOMATED) {
            throw new OperationNotAllowedException("Автоматичний прогноз не потребує перерахунку");
        }

        permissionService.validateEditable(prediction.getDiagnosis(), "перераховувати оцінки прогнозу");

        calculatePredictedTimeHours(prediction);
        calculatePredictedCost(prediction);
        calculatePredictedComplexityLevel(prediction);
    }
}
