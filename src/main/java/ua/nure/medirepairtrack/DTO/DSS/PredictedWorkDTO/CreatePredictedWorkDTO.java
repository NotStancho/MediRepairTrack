package ua.nure.medirepairtrack.DTO.DSS.PredictedWorkDTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedWorkDTO {

    @NotNull(message = "Прогноз обовʼязковий")
    private Integer predictionId;

    @NotNull(message = "Ремонтна робота обовʼязкова")
    private Integer repairWorkId;

    @NotNull(message = "Ймовірність обовʼязкова")
    @DecimalMin(value = "0.0", message = "Ймовірність не може бути менше 0")
    @DecimalMax(value = "1.0", message = "Ймовірність не може бути більше 1")
    private BigDecimal probabilityScore;

    @NotNull(message = "Прогнозований час обовʼязковий")
    @DecimalMin(value = "0.0", message = "Прогнозований час не може бути менше 0")
    private BigDecimal predictedTimeSpent;

}
