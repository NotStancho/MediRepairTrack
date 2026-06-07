package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.CreateManualPredictionDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.DiagnosisPredictionResponseDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.UpdatePredictionDTO;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Entity.diagnosis.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Exception.OperationNotAllowedException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.diagnosis.DiagnosisService;
import ua.nure.medirepairtrack.Workflow.DiagnosisStatusMachine;
import ua.nure.medirepairtrack.Workflow.StatusMessageUtil;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisPredictionService {

    private final DiagnosisPredictionRepository diagnosisPredictionRepository;

    private final DiagnosisService diagnosisService;
    private final ComplexityLevelService complexityLevelService;

    private final PredictionAggregationService predictionAggregationService;
    private final PredictionExplanationService predictionExplanationService;

    private final PredictionStateService predictionStateService;

    private final DiagnosisStatusMachine diagnosisStatusMachine;

    @Transactional
    public DiagnosisPredictionResponseDTO createManualPrediction(CreateManualPredictionDTO dto) {

        Diagnosis diagnosis = diagnosisService.getDiagnosisEntity(dto.getDiagnosisId());

        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "створювати прогноз діагностики",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        ComplexityLevel complexity = complexityLevelService.getEntity(dto.getPredictedComplexityLevelId());

        BigDecimal cost = dto.getPredictedCost() != null
                ? dto.getPredictedCost()
                : BigDecimal.ZERO;

        BigDecimal time = dto.getPredictedTimeHours() != null
                ? dto.getPredictedTimeHours()
                : BigDecimal.ZERO;

        DiagnosisPrediction prediction = DiagnosisPrediction.builder()
                .diagnosis(diagnosis)
                .predictedComplexityLevel(complexity)
                .predictionSource(PredictionSource.MANUAL)
                .predictedCost(cost)
                .predictedTimeHours(time)
                .predictionExplanation(dto.getPredictionExplanation())
                .predictedWarrantyProbability(BigDecimal.ZERO) // default
                .confidenceScore(BigDecimal.ZERO) // default
                .modelVersion("manual")
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPrediction savedPrediction = diagnosisPredictionRepository.save(prediction);

        return map(savedPrediction);
    }

    @Transactional
    public void generateAutoPrediction(Integer diagnosisId) {

        Diagnosis diagnosis = diagnosisService.getDiagnosisEntity(diagnosisId);

        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "генерувати прогноз діагностики",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        // temporary
        ComplexityLevel complexity = complexityLevelService.getEntity(1);

        DiagnosisPrediction prediction = DiagnosisPrediction.builder()
                .diagnosis(diagnosis)
                .predictedComplexityLevel(complexity)
                .predictionSource(PredictionSource.AUTOMATED)
                .predictedCost(BigDecimal.ZERO)
                .predictedTimeHours(BigDecimal.ZERO)
                .predictionExplanation("Пояснення прогнозу ще не сформовано")
                .predictedWarrantyProbability(BigDecimal.ZERO)
                .confidenceScore(BigDecimal.ZERO)
                .modelVersion("similarity-v1")
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPrediction savedPrediction = diagnosisPredictionRepository.save(prediction);

        predictionAggregationService.generatePredictionData(savedPrediction);
        applyPredictionInitialValuesToDiagnosis(savedPrediction);
    }

    private void applyPredictionInitialValuesToDiagnosis(DiagnosisPrediction prediction) {
        Diagnosis diagnosis = prediction.getDiagnosis();

        diagnosis.setEstimatedCost(prediction.getPredictedCost());
        diagnosis.setEstimatedTimeHours(prediction.getPredictedTimeHours());
        diagnosis.setPreliminaryConclusion("Система сформувала попередню рекомендацію. Остаточний висновок має підтвердити інженер.");
    }

    @Transactional
    public DiagnosisPredictionResponseDTO updatePrediction(Integer id, UpdatePredictionDTO dto) {

        DiagnosisPrediction prediction = getDiagnosisPredictionEntity(id);

        Diagnosis diagnosis = prediction.getDiagnosis();

        // перевірка статусу
        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "редагувати прогноз діагностики",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        if (dto.getPredictedComplexityLevelId() != null) {
            ComplexityLevel complexity = complexityLevelService.getEntity(dto.getPredictedComplexityLevelId());
            prediction.setPredictedComplexityLevel(complexity);
        }

        if (dto.getPredictedCost() != null) {
            prediction.setPredictedCost(dto.getPredictedCost());
        }

        if (dto.getPredictedTimeHours() != null) {
            prediction.setPredictedTimeHours(dto.getPredictedTimeHours());
        }

        if (dto.getPredictionExplanation() != null) {
            prediction.setPredictionExplanation(dto.getPredictionExplanation());
        }

        predictionStateService.markAsHybridIfNeeded(prediction);

        prediction.setUpdatedAt(LocalDateTime.now());

        DiagnosisPrediction saved = diagnosisPredictionRepository.save(prediction);

        return map(saved);
    }

    @Transactional
    public DiagnosisPredictionResponseDTO regenerateExplanation(Integer id) {

        DiagnosisPrediction prediction = getDiagnosisPredictionEntity(id);
        Diagnosis diagnosis = prediction.getDiagnosis();

        if (!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "перегенерувати пояснення прогнозу діагностики",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        if (prediction.getPredictionSource() != PredictionSource.AUTOMATED) {
            throw new OperationNotAllowedException("Перегенерація пояснення доступна тільки для автоматичного прогнозу");
        }

        String explanation = predictionExplanationService.generateExplanation(
                predictionExplanationService.build(prediction)
        );

        prediction.setPredictionExplanation(explanation);
        prediction.setUpdatedAt(LocalDateTime.now());

        DiagnosisPrediction saved = diagnosisPredictionRepository.save(prediction);

        return map(saved);
    }

    @Transactional
    public void deletePrediction(Integer id) {
        DiagnosisPrediction prediction = getDiagnosisPredictionEntity(id);
        Diagnosis diagnosis = prediction.getDiagnosis();

        if(!diagnosisStatusMachine.allowsDiagnosisEdit(diagnosis.getStatus())) {
            throw new OperationNotAllowedException(
                    StatusMessageUtil.denied(
                            "видалити прогноз діагностики",
                            diagnosis.getStatus(),
                            diagnosisStatusMachine.allowedDiagnosisEditStatuses()
                    )
            );
        }

        diagnosisPredictionRepository.delete(prediction);
    }

    public DiagnosisPredictionResponseDTO getById(Integer id) {
        return map(getDiagnosisPredictionEntity(id));
    }

    public List<DiagnosisPredictionResponseDTO> getAllByDiagnosisId(Integer diagnosisId) {
        return diagnosisPredictionRepository.findByDiagnosisIdOrderByCreatedAtDesc(diagnosisId)
                .stream()
                .map(this::map)
                .toList();
    }

    public DiagnosisPrediction getDiagnosisPredictionEntity(Integer id) {
        return diagnosisPredictionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Прогноз діагностики з таким ID не знайдено"));
    }

    private DiagnosisPredictionResponseDTO map(DiagnosisPrediction p) {

        return DiagnosisPredictionResponseDTO.builder()
                .id(p.getId())
                .diagnosisId(p.getDiagnosis().getId())
                .predictedComplexityLevel(complexityLevelService.mapShort(p.getPredictedComplexityLevel()))
                .predictionSource(p.getPredictionSource())
                .predictedCost(p.getPredictedCost())
                .predictedTimeHours(p.getPredictedTimeHours())
                .predictionExplanation(p.getPredictionExplanation())
                .predictedWarrantyProbability(p.getPredictedWarrantyProbability())
                .confidenceScore(p.getConfidenceScore())
                .modelVersion(p.getModelVersion())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
