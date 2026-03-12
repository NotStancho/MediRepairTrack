package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.DSS.DiagnosisPrediction.PredictionSource;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class DiagnosisPredictionResponseDTO {

    private Integer id;
    private Integer diagnosisId;

    private Integer predictedDefectCategoryId;
    private Integer predictedComplexityLevelId;

    private PredictionSource predictionSource;

    private BigDecimal predictedCost;
    private BigDecimal predictedTimeHours;

    private String predictedRootCause;

    private BigDecimal predictedWarrantyProbability;

    private BigDecimal confidenceScore;

    private String modelVersion;

    private String inputSnapshot;

    private LocalDateTime createdAt;
}