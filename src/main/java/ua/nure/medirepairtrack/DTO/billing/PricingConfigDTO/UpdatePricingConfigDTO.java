package ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePricingConfigDTO {

    @DecimalMin("0.00")
    private BigDecimal laborPricePerHour;

    @DecimalMin("0.00")
    private BigDecimal laborMinHours;

    @DecimalMin("0.00")
    private BigDecimal partsCoefficient;

    @DecimalMin("0.00")
    private BigDecimal deliveryCoefficient;

    private String description;
}
