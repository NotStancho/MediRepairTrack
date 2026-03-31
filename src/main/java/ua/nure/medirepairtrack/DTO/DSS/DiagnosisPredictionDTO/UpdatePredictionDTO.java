package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePredictionDTO {

    private Integer predictedComplexityLevelId;

    private BigDecimal predictedCost;

    private BigDecimal predictedTimeHours;

    private String predictionExplanation;
}
