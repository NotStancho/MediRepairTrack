package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateDiagnosisPredictionDTO {

    @NotNull
    private Integer diagnosisId;

    @NotNull
    private Integer predictedDefectCategoryId;

    @NotNull
    private Integer predictedComplexityLevelId;

    @NotNull
    private BigDecimal predictedCost;

    @NotNull
    private BigDecimal predictedTimeHours;

    @NotNull
    private String predictedRootCause;

    @NotNull
    private BigDecimal predictedWarrantyProbability;

    @NotNull
    private BigDecimal confidenceScore;

    @NotNull
    private String modelVersion;

    @NotNull
    private String inputSnapshot;
}