package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateManualPredictionDTO {

    @NotNull(message = "Діагностика обовʼязкова")
    private Integer diagnosisId;

    @NotNull(message = "Рівень складності обовʼязковий")
    private Integer predictedComplexityLevelId;

    @NotNull(message = "Вартість обовʼязкова")
    @DecimalMin(value = "0.0", inclusive = false, message = "Вартість повинна бути більшою за 0")
    private BigDecimal predictedCost;

    @NotNull(message = "Час обовʼязковий")
    @DecimalMin(value = "0.0", inclusive = false, message = "Час повинен бути більшим за 0")
    private BigDecimal predictedTimeHours;

    @NotNull
    private String predictionExplanation;
}