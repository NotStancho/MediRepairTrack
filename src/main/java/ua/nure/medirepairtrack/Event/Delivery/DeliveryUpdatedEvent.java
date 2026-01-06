package ua.nure.medirepairtrack.Event.Delivery;

import ua.nure.medirepairtrack.Entity.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;

import java.math.BigDecimal;

public record DeliveryUpdatedEvent(
        Integer claimId,
        Integer deliveryId,
        Integer employeeId,

        DeliveryType type,
        DeliveryProvider provider,

        String trackingCode,

        BigDecimal distanceKm,
        BigDecimal pricePerUnit,
        BigDecimal price
) {
}
