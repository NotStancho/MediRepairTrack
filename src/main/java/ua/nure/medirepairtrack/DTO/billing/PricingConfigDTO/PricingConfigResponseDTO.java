package ua.nure.medirepairtrack.DTO.billing.PricingConfigDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PricingConfigResponseDTO {

    private RepairType repairType;
    private BigDecimal laborPricePerHour;
    private BigDecimal laborMinHours;
    private BigDecimal partsCoefficient;
    private BigDecimal deliveryCoefficient;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
