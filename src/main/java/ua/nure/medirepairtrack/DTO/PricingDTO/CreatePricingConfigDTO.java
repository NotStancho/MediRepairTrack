package ua.nure.medirepairtrack.DTO.PricingDTO;

import jakarta.validation.constraints.*;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Claim.RepairType;

import java.math.BigDecimal;

@Data
public class CreatePricingConfigDTO {

    @NotNull
    private RepairType repairType;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal laborPricePerHour;

    @DecimalMin("0.00")
    private BigDecimal laborMinHours;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal partsCoefficient;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal deliveryCoefficient;

    private String description;
}
