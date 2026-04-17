package ua.nure.medirepairtrack.DTO.DSS.PredictedDefect;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePredictedDefectDTO {

    @NotNull(message = "Прогноз обовʼязковий")
    private Integer predictionId;

    @NotNull(message = "Категорія дефекту обовʼязкова")
    private Integer defectCategoryId;

    @NotNull(message = "Ймовірність обовʼязкова")
    @DecimalMin(value = "0.0", message = "Ймовірність не може бути менше 0")
    @DecimalMax(value = "1.0", message = "Ймовірність не може бути більше 1")
    private BigDecimal probabilityScore;

}