package ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedWorkPartDTO {

    @NotNull(message = "Прогноз обовʼязковий")
    private Integer predictionId;

    @NotNull(message = "Ремонтна робота обовʼязкова")
    private Integer repairWorkId;

    @NotNull(message = "Запчастина обовʼязкова")
    private Integer partId;

    @NotNull(message = "Прогнозована кількість обовʼязкова")
    @DecimalMin(value = "0.001", message = "Прогнозована кількість має бути більше 0")
    private BigDecimal predictedQuantity;

    @NotNull(message = "Ймовірність обовʼязкова")
    @DecimalMin(value = "0.0", message = "Ймовірність не може бути менше 0")
    @DecimalMax(value = "1.0", message = "Ймовірність не може бути більше 1")
    private BigDecimal probabilityScore;
}