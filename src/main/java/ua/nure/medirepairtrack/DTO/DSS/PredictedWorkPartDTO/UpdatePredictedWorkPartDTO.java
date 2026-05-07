package ua.nure.medirepairtrack.DTO.DSS.PredictedWorkPartDTO;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePredictedWorkPartDTO {

    @DecimalMin(value = "0.001", message = "Прогнозована кількість має бути більше 0")
    private BigDecimal predictedQuantity;

    @DecimalMin(value = "0.0", message = "Ймовірність не може бути менше 0")
    @DecimalMax(value = "1.0", message = "Ймовірність не може бути більше 1")
    private BigDecimal probabilityScore;
}
