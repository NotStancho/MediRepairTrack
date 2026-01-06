package ua.nure.medirepairtrack.DTO.DeliveryDTO;

import lombok.Builder;
import lombok.Data;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;

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

