package ua.nure.medirepairtrack.DTO.claim.ClaimWorkPartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateClaimWorkPartDTO {

    @NotNull(message = "ID запчастини обов'язковий")
    private Integer partId;

    @NotNull(message = "Кількість запчастини обов'язкова")
    @DecimalMin(value = "0.001", inclusive = true)
    private BigDecimal quantity;
}
