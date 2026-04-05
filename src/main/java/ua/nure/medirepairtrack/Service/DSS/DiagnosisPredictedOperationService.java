package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.CreatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.PredictedOperationResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedOperation.UpdatePredictedOperationDTO;
import ua.nure.medirepairtrack.DTO.RepairOperation.RepairOperationShortDTO;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperation;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedOperation.DiagnosisPredictedOperationId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.RepairOperation.RepairOperation;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedOperationRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.ClaimRepairOperationService;
import ua.nure.medirepairtrack.Service.RepairOperationService;
import ua.nure.medirepairtrack.Workflow.DiagnosisStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

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
    private final RepairOperationService repairOperationService;

    private final PredictionStateService predictionStateService;
    private final DiagnosisStatusMachine diagnosisStatusMachine;

    @Transactional
    public PredictedOperationResponseDTO create(CreatePredictedOperationDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        validateEditable(diagnosis, "додавати прогнозовані операції");

        RepairOperation operation = repairOperationService.getOperationEntity(dto.getOperationId());

        DiagnosisPredictedOperationId id = new DiagnosisPredictedOperationId(
                dto.getPredictionId(),
                dto.getOperationId()
        );

        if (repository.existsById(id)) {
            throw new OperationNotAllowedException("Ця операція вже додана");
        }

        Integer maxRank = repository.findMaxRankByPredictionId(dto.getPredictionId());
        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictedOperation entity = DiagnosisPredictedOperation.builder()
                .id(id)
                .prediction(prediction)
                .operation(operation)
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

        Map<Integer, Double> operationScores = new HashMap<>();
        Map<Integer, Double> operationWeightedTimeSums = new HashMap<>();
        Map<Integer, Double> operationSimilaritySums = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaimId();
            double similarity = result.getSimilarityScore().doubleValue();

            var operations = claimRepairOperationService.getClaimOperations(claimId);

            Map<Integer, Double> operationTimesInClaim = new HashMap<>();

            for (var op : operations) {

                Integer operationId = op.getOperation().getId();
                double timeSpent = op.getTimeSpent().doubleValue();

                operationTimesInClaim.merge(operationId, timeSpent, Double::sum);
            }

            for (var entry : operationTimesInClaim.entrySet()) {

                Integer operationId = entry.getKey();
                double totalTimeInClaim = entry.getValue();

                operationScores.merge(operationId, similarity, Double::sum);
                operationWeightedTimeSums.merge(operationId, similarity * totalTimeInClaim, Double::sum);
                operationSimilaritySums.merge(operationId, similarity, Double::sum);
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

            double weightedTimeSum = operationWeightedTimeSums.get(operationId);
            double similaritySum = operationSimilaritySums.get(operationId);

            double predictedTime = weightedTimeSum / similaritySum;

            DiagnosisPredictedOperation entity = DiagnosisPredictedOperation.builder()
                    .id(new DiagnosisPredictedOperationId(predictionId, operationId))
                    .prediction(prediction)
                    .operation(repairOperationService.getOperationEntity(operationId))
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
    public PredictedOperationResponseDTO update(Integer predictionId, Integer operationId, UpdatePredictedOperationDTO dto) {

        DiagnosisPredictedOperationId id =
                new DiagnosisPredictedOperationId(predictionId, operationId);

        DiagnosisPredictedOperation entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану операцію не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану операцію");

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
    public void delete(Integer predictionId, Integer operationId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану операцію");

        repository.deleteById(new DiagnosisPredictedOperationId(predictionId, operationId));

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedOperationResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedOperationResponseDTO getById(Integer predictionId, Integer operationId) {

        DiagnosisPredictedOperationId id =
                new DiagnosisPredictedOperationId(predictionId, operationId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану операцію не знайдено"));
    }

    public List<RepairOperationShortDTO> getAvailableOperations(Integer predictionId) {

        predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        var usedOperationIds = repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(e -> e.getOperation().getId())
                .collect(Collectors.toSet());

        return repairOperationService.getAllOperationsShort().stream()
                .filter(op -> !usedOperationIds.contains(op.getId()))
                .toList();
    }

    private void validateEditable(Diagnosis diagnosis, String action) {
        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            action,
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }
    }

    private PredictedOperationResponseDTO map(DiagnosisPredictedOperation e) {
        return PredictedOperationResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .operationId(e.getOperation().getId())
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .predictedTimeSpent(e.getPredictedTimeSpent())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
