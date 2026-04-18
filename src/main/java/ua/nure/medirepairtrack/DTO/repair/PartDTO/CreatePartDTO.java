package ua.nure.medirepairtrack.DTO.repair.PartDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.repair.Part.UnitType;

import java.math.BigDecimal;

@Data
public class CreatePartDTO {

    @NotBlank
    @Size(max = 45)
    private String supplierName;

    @NotBlank
    @Size(max = 50)
    private String partCode;

    @NotBlank
    @Size(max = 100)
    private String partName;

    @NotNull
    @DecimalMin(value = "0.000", inclusive = true)
    private BigDecimal stockQuantity;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = false)
    private BigDecimal price;

    @NotBlank
    @Size(max = 20)
    private String unitName;

    @NotNull
    private UnitType unitType;

    private String description;
}
