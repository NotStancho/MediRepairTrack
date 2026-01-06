package ua.nure.medirepairtrack.DTO.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateEngineerDeliveryDTO {

    @NotNull
    @DecimalMin("0.1")
    private BigDecimal distanceKm;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal pricePerUnit;

    private String description;
}
