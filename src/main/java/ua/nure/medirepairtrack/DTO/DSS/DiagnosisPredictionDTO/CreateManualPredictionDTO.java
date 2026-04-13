package ua.nure.medirepairtrack.DTO.DSS.DiagnosisPredictionDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateManualPredictionDTO {

    @NotNull(message = "Діагностика обовʼязкова")
    private Integer diagnosisId;

    @NotNull(message = "Рівень складності обовʼязковий")
    private Integer predictedComplexityLevelId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Вартість повинна бути більшою за 0")
    private BigDecimal predictedCost;

    @DecimalMin(value = "0.0", inclusive = false, message = "Час повинен бути більшим за 0")
    private BigDecimal predictedTimeHours;

    @NotBlank(message = "Пояснення обовʼязкове")
    private String predictionExplanation;
}