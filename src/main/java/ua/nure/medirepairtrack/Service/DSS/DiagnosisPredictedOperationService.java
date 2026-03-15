package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperationId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedOperationRepository;
import ua.nure.medirepairtrack.Service.ClaimRepairOperationService;
import ua.nure.medirepairtrack.Service.RepairOperationService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictedOperationService {

    @Value("${dss.predicted-operations.top-k}")
    private int topK;

    @Value("${dss.predicted-operations.min-probability}")
    private double minProbability;

    private final DiagnosisPredictedOperationRepository repository;

    private final DiagnosisSimilarityResultService similarityResultService;

    private final ClaimRepairOperationService claimRepairOperationService;
    private final RepairOperationService repairOperationService;

    @Transactional
    public void generatePredictedOperations(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getByPrediction(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        Map<Integer, Double> operationScores = new HashMap<>();
        Map<Integer, Double> operationTimes = new HashMap<>();
        Map<Integer, Integer> operationCounts = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaimId();
            double similarity = result.getSimilarityScore().doubleValue();

            var operations = claimRepairOperationService.getClaimOperations(claimId);

            for (var op : operations) {

                Integer operationId = op.getOperation().getId();
                double timeSpent = op.getTimeSpent().doubleValue();

                double score = similarity * timeSpent;

                operationScores.merge(operationId, score, Double::sum);
                operationTimes.merge(operationId, timeSpent, Double::sum);
                operationCounts.merge(operationId, 1, Integer::sum);
            }
        }

        if (operationScores.isEmpty()) {
            return;
        }

        double totalScore = operationScores.values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        if (totalScore == 0) {
            return;
        }

        List<Map.Entry<Integer, Double>> ranked = operationScores.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .toList();

        int rank = 1;

        for (var entry : ranked) {

            Integer operationId = entry.getKey();
            double score = entry.getValue();

            BigDecimal probability = BigDecimal.valueOf(score)
                    .divide(BigDecimal.valueOf(totalScore), 4, RoundingMode.HALF_UP);

            if (probability.doubleValue() < minProbability) {
                continue;
            }

            double totalTime = operationTimes.get(operationId);
            int count = operationCounts.get(operationId);

            double avgTime = totalTime / count;

            repository.save(
                    DiagnosisPredictedOperation.builder()
                            .id(new DiagnosisPredictedOperationId(predictionId, operationId))
                            .prediction(prediction)
                            .operation(repairOperationService.getOperationEntity(operationId))
                            .probabilityScore(probability)
                            .rankPosition(rank++)
                            .predictedTimeSpent(
                                    BigDecimal.valueOf(avgTime).setScale(2, RoundingMode.HALF_UP)
                            )
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }
    }

}
