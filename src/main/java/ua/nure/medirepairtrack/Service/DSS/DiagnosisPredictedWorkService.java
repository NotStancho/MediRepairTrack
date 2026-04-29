package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.CreatePredictedWorkDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.PredictedWorkResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO.UpdatePredictedWorkDTO;
import ua.nure.medirepairtrack.DTO.repair.RepairWork.RepairWorkShortDTO;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWork;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictedWork.DiagnosisPredictedWorkId;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.repair.RepairWork.RepairWork;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictedWorkRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimWorkService;
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
public class DiagnosisPredictedWorkService {

    @Value("${dss.predicted-works.top-k}")
    private int topK;

    @Value("${dss.predicted-works.min-probability}")
    private double minProbability;

    private final DiagnosisPredictedWorkRepository repository;
    private final DiagnosisPredictionRepository predictionRepository;

    private final DiagnosisSimilarityResultService similarityResultService;
    private final ClaimWorkService claimWorkService;
    private final RepairWorkService repairWorkService;

    private final PredictionStateService predictionStateService;
    private final DiagnosisPermissionService permissionService;

    @Transactional
    public PredictedWorkResponseDTO create(CreatePredictedWorkDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати прогнозовані роботи");

        RepairWork repairWork = repairWorkService.getEntity(dto.getRepairWorkId());

        DiagnosisPredictedWorkId id = new DiagnosisPredictedWorkId(
                dto.getPredictionId(),
                dto.getRepairWorkId()
        );

        if (repository.existsById(id)) {
            throw new BadRequestException("Ця ремонтна робота вже додана");
        }

        Integer maxRank = repository.findMaxRankByPredictionId(dto.getPredictionId());
        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictedWork entity = DiagnosisPredictedWork.builder()
                .id(id)
                .prediction(prediction)
                .repairWork(repairWork)
                .probabilityScore(dto.getProbabilityScore())
                .rankPosition(newRank)
                .predictedTimeSpent(dto.getPredictedTimeSpent())
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPredictedWork saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }
    @Transactional
    public List<PredictedWorkResponseDTO> createBatch(List<CreatePredictedWorkDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generatePredictedWorks(DiagnosisPrediction prediction) {

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

            var repairWorks = claimWorkService.getClaimWorks(claimId);

            Map<Integer, Double> repairWorkTimesInClaim = new HashMap<>();

            for (var work : repairWorks) {

                Integer repairWorkId = work.getRepairWork().getId();
                double timeSpent = work.getTimeSpent().doubleValue();

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

            DiagnosisPredictedWork entity = DiagnosisPredictedWork.builder()
                    .id(new DiagnosisPredictedWorkId(predictionId, repairWorkId))
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
    public PredictedWorkResponseDTO update(Integer predictionId, Integer repairWorkId, UpdatePredictedWorkDTO dto) {

        DiagnosisPredictedWorkId id =
                new DiagnosisPredictedWorkId(predictionId, repairWorkId);

        DiagnosisPredictedWork entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану ремонтну роботу");

        if (dto.getProbabilityScore() != null) {
            entity.setProbabilityScore(dto.getProbabilityScore());
        }

        if (dto.getPredictedTimeSpent() != null) {
            entity.setPredictedTimeSpent(dto.getPredictedTimeSpent());
        }

        DiagnosisPredictedWork saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer repairWorkId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану ремонтну роботу");

        repository.deleteById(new DiagnosisPredictedWorkId(predictionId, repairWorkId));

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedWorkResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedWorkResponseDTO getById(Integer predictionId, Integer repairWorkId) {

        DiagnosisPredictedWorkId id =
                new DiagnosisPredictedWorkId(predictionId, repairWorkId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану ремонтну роботу не знайдено"));
    }

    public List<RepairWorkShortDTO> getAvailableWorks(Integer predictionId) {

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


    private PredictedWorkResponseDTO map(DiagnosisPredictedWork e) {
        return PredictedWorkResponseDTO.builder()
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
