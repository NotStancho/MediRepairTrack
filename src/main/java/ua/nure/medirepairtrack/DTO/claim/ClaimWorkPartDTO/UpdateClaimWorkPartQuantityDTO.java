package ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateClaimWorkPartQuantityDTO {

    @NotNull(message = "ID запчастини обов'язковий")
    private Integer partId;

    @NotNull(message = "Нова кількість обов'язкова")
    @DecimalMin(value = "0.001", inclusive = true, message = "Нова кількість має бути більше 0")
    private BigDecimal newQuantity;
}
