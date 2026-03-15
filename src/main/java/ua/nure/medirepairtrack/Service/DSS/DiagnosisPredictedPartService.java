package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.CreatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.PredictedPartResponseDTO;
import ua.nure.medirepairtrack.Entity.DSS.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPartId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.Part.Part;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedPartRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.PartService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictedPartService {
    @Value("${dss.predicted-parts.top-k}")
    private int topK;

    @Value("${dss.predicted-parts.min-probability}")
    private double minProbability;

    private final DiagnosisPredictedPartRepository repository;

    private final PartService partService;
    private final DiagnosisSimilarityResultService similarityResultService;

    private final DiagnosisPredictionRepository predictionRepository;


    @Transactional
    public PredictedPartResponseDTO create(CreatePredictedPartDTO dto) {
        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Part part = partService.getPartEntity(dto.getPartId());

        DiagnosisPredictedPart entity = DiagnosisPredictedPart.builder()
                        .id(new DiagnosisPredictedPartId(
                                dto.getPredictionId(),
                                dto.getPartId()
                        ))
                        .prediction(prediction)
                        .part(part)
                        .probabilityScore(dto.getProbabilityScore())
                        .rankPosition(dto.getRankPosition())
                        .createdAt(LocalDateTime.now())
                        .build();

        return map(repository.save(entity));
    }

    @Transactional
    public void generatePredictedParts(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getByPrediction(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        Map<Integer, Double> partScores = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaimId();
            double similarity = result.getSimilarityScore().doubleValue();

            var usedParts = partService.getUsedPartsByClaim(claimId);

            for (var part : usedParts) {

                Integer partId = part.getPartId();
                double quantity = part.getQuantity().doubleValue();

                double score = similarity * quantity;

                partScores.merge(partId, score, Double::sum);
            }
        }

        if (partScores.isEmpty()) {
            return;
        }

        double totalScore = partScores.values().stream().mapToDouble(Double::doubleValue).sum();

        List<Map.Entry<Integer, Double>> ranked = partScores.entrySet().stream()
                        .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                        .limit(topK)
                        .toList();

        int rank = 1;

        for (var entry : ranked) {

            Integer partId = entry.getKey();
            double score = entry.getValue();

            BigDecimal probability = BigDecimal.valueOf(score)
                    .divide(BigDecimal.valueOf(totalScore), 4, RoundingMode.HALF_UP);

            if (probability.doubleValue() < minProbability) {
                continue;
            }

            CreatePredictedPartDTO dto = new CreatePredictedPartDTO();
            dto.setPredictionId(predictionId);
            dto.setPartId(partId);
            dto.setProbabilityScore(probability);
            dto.setRankPosition(rank++);

            create(dto);
        }
    }

    public List<PredictedPartResponseDTO> getByPrediction(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    private PredictedPartResponseDTO map(DiagnosisPredictedPart e) {
        return PredictedPartResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .partId(e.getPart().getId())
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }

}