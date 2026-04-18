package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefectDTO.CreatePredictedDefectDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefectDTO.PredictedDefectResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.PredictedDefectDTO.UpdatePredictedDefectDTO;
import ua.nure.medirepairtrack.DTO.diagnosis.DefectCategoryDTO.DefectCategoryShortResponseDTO;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPredictionDefect.*;
import ua.nure.medirepairtrack.Entity.diagnosis.DefectCategory.DefectCategory;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Exception.BadRequestException;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionDefectRepository;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.claim.ClaimDefectCategoryService;
import ua.nure.medirepairtrack.Service.diagnosis.DefectCategoryService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictionDefectService {

    @Value("${dss.predicted-defects.top-k}")
    private int topK;

    @Value("${dss.predicted-defects.min-probability}")
    private double minProbability;

    private final DiagnosisPredictionDefectRepository repository;
    private final DiagnosisPredictionRepository predictionRepository;

    private final DiagnosisSimilarityResultService similarityResultService;
    private final ClaimDefectCategoryService claimDefectCategoryService;
    private final DefectCategoryService defectCategoryService;

    private final PredictionStateService predictionStateService;
    private final DiagnosisPermissionService permissionService;

    @Transactional
    public PredictedDefectResponseDTO create(CreatePredictedDefectDTO dto) {

        DiagnosisPrediction prediction = predictionRepository.findById(dto.getPredictionId())
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        Diagnosis diagnosis = prediction.getDiagnosis();

        permissionService.validateEditable(diagnosis, "додавати прогнозовані категорії дефектів");

        DefectCategory defectCategory = defectCategoryService.getEntity(dto.getDefectCategoryId());

        DiagnosisPredictionDefectId id = new DiagnosisPredictionDefectId(
                dto.getPredictionId(),
                dto.getDefectCategoryId()
        );

        if (repository.existsById(id)) {
            throw new BadRequestException("Ця категорія дефекту вже додана");
        }

        Integer maxRank = repository.findMaxRankByPredictionId(dto.getPredictionId());
        int newRank = (maxRank != null ? maxRank : 0) + 1;

        DiagnosisPredictionDefect entity = DiagnosisPredictionDefect.builder()
                .id(id)
                .prediction(prediction)
                .defectCategory(defectCategory)
                .probabilityScore(dto.getProbabilityScore())
                .rankPosition(newRank)
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPredictionDefect saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }
    @Transactional
    public List<PredictedDefectResponseDTO> createBatch(List<CreatePredictedDefectDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    // DO NOT mark as HYBRID - system generated
    @Transactional
    public void generatePredictedDefects(DiagnosisPrediction prediction) {

        Integer predictionId = prediction.getId();

        var similarityResults = similarityResultService.getAllByPredictionId(predictionId);

        if (similarityResults.isEmpty()) {
            return;
        }

        Map<Integer, Double> defectScores = new HashMap<>();

        for (var result : similarityResults) {

            Integer claimId = result.getClaim().getId();
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

            DiagnosisPredictionDefect entity = DiagnosisPredictionDefect.builder()
                            .id(new DiagnosisPredictionDefectId(predictionId, defectCategoryId))
                            .prediction(prediction)
                            .defectCategory(defectCategoryService.getEntity(defectCategoryId))
                            .probabilityScore(probability)
                            .rankPosition(rank++)
                            .createdAt(LocalDateTime.now())
                            .build();

            repository.save(entity);
        }
    }

    @Transactional
    public PredictedDefectResponseDTO update(Integer predictionId, Integer defectCategoryId, UpdatePredictedDefectDTO dto) {

        DiagnosisPredictionDefectId id =
                new DiagnosisPredictionDefectId(predictionId, defectCategoryId);

        DiagnosisPredictionDefect entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогнозовану категорію дефекту не знайдено"));

        DiagnosisPrediction prediction = entity.getPrediction();

        permissionService.validateEditable(prediction.getDiagnosis(), "редагувати прогнозовану категорію дефекту");

        if (dto.getProbabilityScore() != null) {
            entity.setProbabilityScore(dto.getProbabilityScore());
        }

        DiagnosisPredictionDefect saved = repository.save(entity);

        predictionStateService.markAsHybridIfNeeded(prediction);

        return map(saved);
    }

    @Transactional
    public void delete(Integer predictionId, Integer defectCategoryId) {

        DiagnosisPrediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики не знайдено"));

        permissionService.validateEditable(prediction.getDiagnosis(), "видаляти прогнозовану категорію дефекту");

        repository.deleteById(new DiagnosisPredictionDefectId(predictionId, defectCategoryId));

        predictionStateService.markAsHybridIfNeeded(prediction);
    }

    public List<PredictedDefectResponseDTO> getAllByPredictionId(Integer predictionId) {
        return repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(this::map)
                .toList();
    }

    public PredictedDefectResponseDTO getById(Integer predictionId, Integer defectCategoryId) {

        DiagnosisPredictionDefectId id =
                new DiagnosisPredictionDefectId(predictionId, defectCategoryId);

        return repository.findById(id)
                .map(this::map)
                .orElseThrow(() -> new NotFoundException("Прогнозовану категорію дефекту не знайдено"));
    }

    public List<DefectCategoryShortResponseDTO> getAvailableDefects(Integer predictionId) {

        predictionRepository.findById(predictionId)
                .orElseThrow(() -> new NotFoundException("Прогноз не знайдений"));

        var usedDefectIds = repository.findByPredictionIdOrderByRankPosition(predictionId)
                .stream()
                .map(e -> e.getDefectCategory().getId())
                .collect(Collectors.toSet());

        return defectCategoryService.getAllDefectCategoryShort().stream()
                .filter(d -> !usedDefectIds.contains(d.getId()))
                .toList();
    }


    private PredictedDefectResponseDTO map(DiagnosisPredictionDefect e) {
        return PredictedDefectResponseDTO.builder()
                .predictionId(e.getPrediction().getId())
                .defectCategory(DefectCategoryShortResponseDTO.builder()
                        .id(e.getDefectCategory().getId())
                        .name(e.getDefectCategory().getName())
                        .typicalSymptoms(e.getDefectCategory().getTypicalSymptoms())
                        .description(e.getDefectCategory().getDescription())
                        .build()
                )
                .probabilityScore(e.getProbabilityScore())
                .rankPosition(e.getRankPosition())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
