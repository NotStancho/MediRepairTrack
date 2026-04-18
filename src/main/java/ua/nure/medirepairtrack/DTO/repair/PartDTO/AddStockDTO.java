package ua.nure.medirepairtrack.DTO.repair.PartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddStockDTO {

    @NotNull(message = "Кількість для поповнення складу обов'язкова")
    @DecimalMin(value = "0.001", inclusive = true)
    private BigDecimal quantity;
}
