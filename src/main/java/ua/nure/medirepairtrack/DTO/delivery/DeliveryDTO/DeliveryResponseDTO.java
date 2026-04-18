package ua.nure.medirepairtrack.DTO.delivery.DeliveryDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Entity.delivery.Delivery.DeliveryType;

import java.math.BigDecimal;

@Data
@Builder
public class DeliveryResponseDTO {

    private Integer id;
    private Integer claimId;

    private DeliveryType type;
    private DeliveryProvider provider;
    private DeliveryStatus status;

    private String trackingCode;

    private BigDecimal distanceKm;
    private BigDecimal pricePerUnit;
    private BigDecimal price;

    private String description;
}

