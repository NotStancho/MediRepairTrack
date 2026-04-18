package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdatePostalDeliveryDTO {

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    private String trackingCode;

    private String description;
}

