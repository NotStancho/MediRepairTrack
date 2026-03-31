package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.*;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionDefectRepository;
import ua.nure.medirepairtrack.Service.ClaimDefectCategoryService;
import ua.nure.medirepairtrack.Service.DefectCategoryService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictionDefectService {

    @Value("${dss.predicted-defects.top-k}")
    private int topK;

    @Value("${dss.predicted-defects.min-probability}")
    private double minProbability;

    private final DiagnosisPredictionDefectRepository repository;

    private final DiagnosisSimilarityResultService similarityResultService;

    private final ClaimDefectCategoryService claimDefectCategoryService;
    private final DefectCategoryService defectCategoryService;

    @Transactional
    public void generatePredictedDefects(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getAllByPredictionId(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        Map<Integer, Double> defectScores = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaimId();
            double similarity = result.getSimilarityScore().doubleValue();

            var defects = claimDefectCategoryService.getByClaimId(claimId);

            if (defects.isEmpty()) {
                continue;
            }

            for(var defect : defects) {

                Integer defectCategoryId = defect.getDefectCategory().getId();

                defectScores.merge(defectCategoryId, similarity, Double::sum);
            }
        }

        if (defectScores.isEmpty()) {
            return;
        }

        double totalScore = defectScores.values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        if (totalScore == 0) {
            return;
        }

        List<Map.Entry<Integer, Double>> ranked = defectScores.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .toList();

        int rank = 1;

        for (var entry : ranked) {

            Integer defectCategoryId = entry.getKey();
            double score = entry.getValue();

            BigDecimal probability = BigDecimal.valueOf(score)
                    .divide(BigDecimal.valueOf(totalScore), 4, RoundingMode.HALF_UP);

            if (probability.doubleValue() < minProbability) {
                continue;
            }

            repository.save(
                    DiagnosisPredictionDefect.builder()
                            .id(new DiagnosisPredictionDefectId(predictionId, defectCategoryId))
                            .prediction(prediction)
                            .defectCategory(defectCategoryService.getEntity(defectCategoryId))
                            .probabilityScore(probability)
                            .rankPosition(rank++)
                            .createdAt(LocalDateTime.now())
                            .build()
            );
        }
    }

    public List<DiagnosisPredictionDefect> getByPrediction(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId);
    }

}