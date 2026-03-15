package ua.nure.medirepairtrack.Service.DSS;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.CreateDiagnosisPredictionDTO;
import ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO.DiagnosisPredictionResponseDTO;
import ua.nure.medirepairtrack.Entity.DSS.ComplexityLevel;
import ua.nure.medirepairtrack.Entity.Diagnosis.Diagnosis;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.DiagnosisPrediction;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;
import ua.nure.medirepairtrack.Exception.NotFoundException;
import ua.nure.medirepairtrack.Repository.DSS.DiagnosisPredictionRepository;
import ua.nure.medirepairtrack.Service.DiagnosisService;

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

    @Transactional
    public DiagnosisPredictionResponseDTO createPrediction(CreateDiagnosisPredictionDTO dto) {

        Diagnosis diagnosis = diagnosisService.getDiagnosisEntity(dto.getDiagnosisId());

        ComplexityLevel complexity = complexityLevelService.getEntity(dto.getPredictedComplexityLevelId());

        DiagnosisPrediction prediction = DiagnosisPrediction.builder()
                .diagnosis(diagnosis)
                .predictedComplexityLevel(complexity)
                .predictionSource(PredictionSource.AUTOMATED)
                .predictedCost(dto.getPredictedCost())
                .predictedTimeHours(dto.getPredictedTimeHours())
                .predictionExplanation(dto.getPredictionExplanation())
                .predictedWarrantyProbability(dto.getPredictedWarrantyProbability())
                .confidenceScore(dto.getConfidenceScore())
                .modelVersion(dto.getModelVersion())
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPrediction savedPrediction = diagnosisPredictionRepository.save(prediction);

        return map(savedPrediction);
    }

    @Transactional
    public DiagnosisPrediction generatePrediction(Integer diagnosisId) {

        Diagnosis diagnosis = diagnosisService.getDiagnosisEntity(diagnosisId);

        // temporary
        ComplexityLevel complexity = complexityLevelService.getEntity(1);

        DiagnosisPrediction prediction = DiagnosisPrediction.builder()
                .diagnosis(diagnosis)
                .predictedComplexityLevel(complexity)
                .predictionSource(PredictionSource.AUTOMATED)
                .predictedCost(BigDecimal.ZERO)
                .predictedTimeHours(BigDecimal.ZERO)
                .predictionExplanation("AI analysis pending")
                .predictedWarrantyProbability(BigDecimal.ZERO)
                .confidenceScore(BigDecimal.ZERO)
                .modelVersion("similarity-v1")
                .createdAt(LocalDateTime.now())
                .build();

        DiagnosisPrediction savedPrediction = diagnosisPredictionRepository.save(prediction);

        predictionAggregationService.generatePredictionData(savedPrediction);

        return savedPrediction;
    }


    public List<DiagnosisPredictionResponseDTO> getByDiagnosis(Integer diagnosisId) {
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
                .predictedComplexityLevelId(p.getPredictedComplexityLevel().getId())
                .predictionSource(p.getPredictionSource())
                .predictedCost(p.getPredictedCost())
                .predictedTimeHours(p.getPredictedTimeHours())
                .predictionExplanation(p.getPredictionExplanation())
                .predictedWarrantyProbability(p.getPredictedWarrantyProbability())
                .confidenceScore(p.getConfidenceScore())
                .modelVersion(p.getModelVersion())
                .createdAt(p.getCreatedAt())
                .build();
    }
}