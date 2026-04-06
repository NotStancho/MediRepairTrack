package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.CreatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.PredictedPartResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedPart.UpdatePredictedPartDTO;
import ua.nure.medirepairtrack.DTO.PartDTO.PartShortDTO;
import ua.nure.medirepairtrack.Entity.DSS.*;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPart;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedPart.DiagnosisPredictedPartId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.Part.Part;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedPartRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.PartService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    private final PredictionStateService predictionStateService;
    private final DiagnosisPredictionRepository predictionRepository;


    private final DiagnosisPermissionService permissionService;

    @Transactional
    public PredictedPartResponseDTO create(CreatePredictedPartDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати прогнозовані запчастини");

        Part part = partService.getPartEntity(dto.getPartId());

        DiagnosisPredictedPartId id = new DiagnosisPredictedPartId(
                dto.getPredictionId(),
                dto.getPartId()
        );

        if (repository.existsById(id)) {
            throw new OperationNotAllowedException("Ця запчастина вже додана");
        }

        Integer maxRank = repository
                .findMaxRankByPredictionId(dto.getPredictionId());

        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictedPart entity = DiagnosisPredictedPart.builder()
                        .id(id)
                        .prediction(prediction)
                        .part(part)
                        .probabilityScore(dto.getProbabilityScore())
                        .rankPosition(newRank)
                        .createdAt(LocalDateTime.now())
                        .build();

        DiagnosisPredictedPart saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public List<PredictedPartResponseDTO> createBatch(List<CreatePredictedPartDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generatePredictedParts(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getAllByPredictionId(predictionId);

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

                partScores.merge(partId, similarity, Double::sum);
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

            DiagnosisPredictedPart entity = DiagnosisPredictedPart.builder()
                    .id(new DiagnosisPredictedPartId(
                            predictionId,
                            partId
                    ))
                    .prediction(prediction)
                    .part(partService.getPartEntity(partId))
                    .probabilityScore(probability)
                    .rankPosition(rank++)
                    .createdAt(LocalDateTime.now())
                    .build();

            repository.save(entity);
        }
    }

    @Transactional
    public PredictedPartResponseDTO update(Integer predictionId, Integer partId, UpdatePredictedPartDTO dto) {

        DiagnosisPredictedPartId id = new DiagnosisPredictedPartId(predictionId, partId);

        DiagnosisPredictedPart entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану запчастину не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану запчастину");

        if (dto.getProbabilityScore() != null) {
            entity.setProbabilityScore(dto.getProbabilityScore());
        }

        DiagnosisPredictedPart saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer partId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану запчастину");

        repository.deleteById(new DiagnosisPredictedPartId(predictionId, partId));

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedPartResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedPartResponseDTO getById(Integer predictionId, Integer partId) {

        DiagnosisPredictedPartId id =
                new DiagnosisPredictedPartId(predictionId, partId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану запчастину не знайдено"));
    }

    public List<PartShortDTO> getAvailableParts(Integer predictionId) {

       predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        // уже використані
        var usedPartIds = repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(e -> e.getPart().getId())
                .collect(Collectors.toSet());

        return partService.getAllPartsShort().stream()
                .filter(p -> !usedPartIds.contains(p.getId()))
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