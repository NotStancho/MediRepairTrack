package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisSimilarity.SimilarityResultResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictionExplanation.PredictionContext;
import ua.nure.medirepairtrack.DTO.PricingDTO.PricingConfigResponseDTO;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Service.ClaimService;
import ua.nure.medirepairtrack.Service.PartService;
import ua.nure.medirepairtrack.Service.PricingConfigService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionAggregationService {

    private final DiagnosisSimilarityResultService similarityResultService;
    private final DiagnosisPredictedPartService predictedPartService;
    private final DiagnosisPredictedOperationService predictedOperationService;
    private final DiagnosisPredictionDefectService predictedDefectService;
    private final PredictionExplanationService explanationService;

    private final ClaimService claimService;
    private final PartService partService;
    private final PricingConfigService pricingConfigService;
    private final ComplexityLevelService complexityLevelService;

    @Transactional
    public void generatePredictionData(DiagnosisPrediction prediction) {
        // 1. similarity search
        similarityResultService.generateSimilarityResults(prediction);

        // 2. predicted entities
        predictedPartService.generatePredictedParts(prediction);
        predictedOperationService.generatePredictedOperations(prediction);
        predictedDefectService.generatePredictedDefects(prediction);

        // 3. aggregated metrics
        calculatePredictedTimeHours(prediction);

        var similarityResults = similarityResultService.getAllByPredictionId(prediction.getId());

        calculatePredictedCost(prediction);
        calculateWarrantyProbability(prediction, similarityResults);
        calculateConfidenceScore(prediction, similarityResults);

        // 4. rule-based complexity
        calculatePredictedComplexityLevel(prediction);

        // 5. explanation (LLM)
        PredictionContext context = explanationService.build(prediction);

        String explanation = explanationService.generateExplanation(context);

        prediction.setPredictionExplanation(explanation);
    }

    @Transactional
    public void calculatePredictedTimeHours(DiagnosisPrediction prediction) {

        var operations = predictedOperationService.getByPrediction(prediction.getId());

        if (operations.isEmpty()) {
            prediction.setPredictedTimeHours(BigDecimal.ZERO);
            return;
        }

        BigDecimal totalTime = operations.stream()
                .map(DiagnosisPredictedOperation::getPredictedTimeSpent)
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

        PricingConfigResponseDTO config = pricingConfigService.getByRepairType(repairType);

        BigDecimal predictedHours = prediction.getPredictedTimeHours();

        if (config.getLaborMinHours() != null && predictedHours.compareTo(config.getLaborMinHours()) < 0) {

            predictedHours = config.getLaborMinHours();
        }

        BigDecimal laborCost = predictedHours.multiply(config.getLaborPricePerHour());

        var predictedParts = predictedPartService.getByPrediction(prediction.getId());

        BigDecimal partsCost = predictedParts.stream()
                .map(p -> {
                    var part = partService.getPartEntity(p.getPartId());

                    return part.getPrice().multiply(p.getProbabilityScore());
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        partsCost = partsCost.multiply(config.getPartsCoefficient());

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

            var claim = claimService.getClaim(result.getClaimId());

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

        BigDecimal predictedHours = prediction.getPredictedTimeHours();
        BigDecimal predictedCost = prediction.getPredictedCost();
        BigDecimal confidence = prediction.getConfidenceScore();

        int operationsCount = predictedOperationService.getByPrediction(prediction.getId()).size();
        int partsCount = predictedPartService.getByPrediction(prediction.getId()).size();

        if (predictedHours.compareTo(BigDecimal.valueOf(6)) >= 0) {
            complexityScore += 3;
        } else if (predictedHours.compareTo(BigDecimal.valueOf(3)) >= 0) {
            complexityScore += 2;
        } else if (predictedHours.compareTo(BigDecimal.valueOf(1)) >= 0) {
            complexityScore += 1;
        }

        if (operationsCount >= 5) {
            complexityScore += 2;
        } else if (operationsCount >= 3) {
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
}
