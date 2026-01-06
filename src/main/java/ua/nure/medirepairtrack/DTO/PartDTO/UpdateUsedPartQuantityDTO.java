package ua.nure.medirepairtrack.DTO.PartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateUsedPartQuantityDTO {

    @NotNull
    private Integer partId;

    @NotNull
    @DecimalMin(value = "0.000", inclusive = true)
    private BigDecimal newQuantity;
}
