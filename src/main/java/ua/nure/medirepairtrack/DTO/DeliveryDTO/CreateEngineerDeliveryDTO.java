package ua.nure.medirepairtrack.DTO.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;

import java.math.BigDecimal;

@Data
public class CreateEngineerDeliveryDTO {

    @NotNull
    private Integer claimId;

    @NotNull
    private DeliveryType type; // ENGINEER_ON_SITE

    @NotNull
    @DecimalMin("0.1")
    private BigDecimal distanceKm;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal pricePerUnit;

    private String description;
}
