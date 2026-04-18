package ua.nure.medirepairtrack.DTO.claim.UsedPartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateUsedPartQuantityDTO {

    @NotNull(message = "ID запчастини обов'язковий")
    private Integer partId;

    @NotNull(message = "Нова кількість обов'язкова")
    @DecimalMin(value = "0.000", inclusive = true, message = "Нова кількість не може бути від'ємною")
    private BigDecimal newQuantity;
}
