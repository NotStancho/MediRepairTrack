package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.CreatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.PredictedOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperationDTO.UpdatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperationId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedOperationRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimRepairOperationService;
import ua.nure.medirepairtrack.Service.repair.RepairWorkService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictedOperationService {

    @Value("${dss.predicted-operations.top-k}")
    private int topK;

    @Value("${dss.predicted-operations.min-probability}")
    private double minProbability;

    private final DiagnosisPredictedOperationRepository repository;
    private final DiagnosisPredictionRepository predictionRepository;

    private final DiagnosisSimilarityResultService similarityResultService;
    private final ClaimRepairOperationService claimRepairOperationService;
    private final RepairWorkService repairWorkService;

    private final PredictionStateService predictionStateService;
    private final DiagnosisPermissionService permissionService;

    @Transactional
    public PredictedOperationResponseDTO create(CreatePredictedOperationDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати прогнозовані роботи");

        RepairWork repairWork = repairWorkService.getEntity(dto.getRepairWorkId());

        DiagnosisPredictedOperationId id = new DiagnosisPredictedOperationId(
                dto.getPredictionId(),
                dto.getRepairWorkId()
        );

        if (repository.existsById(id)) {
            throw new BadRequestException("Ця ремонтна робота вже додана");
        }

        Integer maxRank = repository.findMaxRankByPredictionId(dto.getPredictionId());
        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictedOperation entity = DiagnosisPredictedOperation.builder()
                .id(id)
                .prediction(prediction)
                .repairWork(repairWork)
                .probabilityScore(dto.getProbabilityScore())
                .rankPosition(newRank)
                .predictedTimeSpent(dto.getPredictedTimeSpent())
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPredictedOperation saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }
    @Transactional
    public List<PredictedOperationResponseDTO> createBatch(List<CreatePredictedOperationDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generatePredictedOperations(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getAllByPredictionId(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        Map<Integer, Double> repairWorkScores = new HashMap<>();
        Map<Integer, Double> repairWorkWeightedTimeSums = new HashMap<>();
        Map<Integer, Double> repairWorkSimilaritySums = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaim().getId();
            double similarity = result.getSimilarityScore().doubleValue();

            var repairWorks = claimRepairOperationService.getClaimOperations(claimId);

            Map<Integer, Double> repairWorkTimesInClaim = new HashMap<>();

            for (var op : repairWorks) {

                Integer repairWorkId = op.getRepairWork().getId();
                double timeSpent = op.getTimeSpent().doubleValue();

                repairWorkTimesInClaim.merge(repairWorkId, timeSpent, Double::sum);
            }

            for (var entry : repairWorkTimesInClaim.entrySet()) {

                Integer repairWorkId = entry.getKey();
                double totalTimeInClaim = entry.getValue();

                repairWorkScores.merge(repairWorkId, similarity, Double::sum);
                repairWorkWeightedTimeSums.merge(repairWorkId, similarity * totalTimeInClaim, Double::sum);
                repairWorkSimilaritySums.merge(repairWorkId, similarity, Double::sum);
            }
        }

        if (repairWorkScores.isEmpty()) {
            return;
        }

        double totalScore = repairWorkScores.values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        if (totalScore == 0) {
            return;
        }

        List<Map.Entry<Integer, Double>> ranked = repairWorkScores.entrySet()
                .stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(topK)
                .toList();

        int rank = 1;

        for (var entry : ranked) {

            Integer repairWorkId = entry.getKey();
            double score = entry.getValue();

            BigDecimal probability = BigDecimal.valueOf(score)
                    .divide(BigDecimal.valueOf(totalScore), 4, RoundingMode.HALF_UP);

            if (probability.doubleValue() < minProbability) {
                continue;
            }

            double weightedTimeSum = repairWorkWeightedTimeSums.get(repairWorkId);
            double similaritySum = repairWorkSimilaritySums.get(repairWorkId);

            if (similaritySum == 0) {
                continue;
            }

            double predictedTime = weightedTimeSum / similaritySum;

            DiagnosisPredictedOperation entity = DiagnosisPredictedOperation.builder()
                    .id(new DiagnosisPredictedOperationId(predictionId, repairWorkId))
                    .prediction(prediction)
                    .repairWork(repairWorkService.getEntity(repairWorkId))
                    .probabilityScore(probability)
                    .rankPosition(rank++)
                    .predictedTimeSpent(
                            BigDecimal.valueOf(predictedTime).setScale(2, RoundingMode.HALF_UP)
                    )
                    .createdAt(LocalDateTime.now())
                    .build();

            repository.save(entity);
        }
    }

    @Transactional
    public PredictedOperationResponseDTO update(Integer predictionId, Integer repairWorkId, UpdatePredictedOperationDTO dto) {

        DiagnosisPredictedOperationId id =
                new DiagnosisPredictedOperationId(predictionId, repairWorkId);

        DiagnosisPredictedOperation entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану ремонтну роботу");

        if (dto.getProbabilityScore() != null) {
            entity.setProbabilityScore(dto.getProbabilityScore());
        }

        if (dto.getPredictedTimeSpent() != null) {
            entity.setPredictedTimeSpent(dto.getPredictedTimeSpent());
        }

        DiagnosisPredictedOperation saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer repairWorkId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану ремонтну роботу");

        repository.deleteById(new DiagnosisPredictedOperationId(predictionId, repairWorkId));

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedOperationResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedOperationResponseDTO getById(Integer predictionId, Integer repairWorkId) {

        DiagnosisPredictedOperationId id =
                new DiagnosisPredictedOperationId(predictionId, repairWorkId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));
    }

    public List<RepairWorkShortDTO> getAvailableOperations(Integer predictionId) {

        predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        var usedRepairWorkIds = repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(e -> e.getRepairWork().getId())
                .collect(Collectors.toSet());

        return repairWorkService.getAllShort().stream()
                .filter(repairWork -> !usedRepairWorkIds.contains(repairWork.getId()))
                .toList();
    }


    private PredictedOperationResponseDTO map(DiagnosisPredictedOperation e) {
        return PredictedOperationResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .repairWork(
                        RepairWorkShortDTO.builder()
                        .id(e.getRepairWork().getId())
                        .name(e.getRepairWork().getName())
                        .complexityLevelName(e.getRepairWork().getComplexityLevel().getName())
                        .build()
                )
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .predictedTimeSpent(e.getPredictedTimeSpent())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
