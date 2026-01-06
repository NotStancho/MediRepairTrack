package ua.nure.medirepairtrack.DTO.PartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UsePartDTO {

    @NotNull
    private Integer partId;

    @NotNull
    @DecimalMin(value = "0.001", inclusive = true)
    private BigDecimal quantity;
}
