package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryType;

import java.math.BigDecimal;

@Data
public class CreatePostalDeliveryDTO {

    @NotNull
    private Integer claimId;

    @NotNull
    private DeliveryType type;

    @NotNull
    private DeliveryProvider provider;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    private String trackingCode;

    private String description;
}
