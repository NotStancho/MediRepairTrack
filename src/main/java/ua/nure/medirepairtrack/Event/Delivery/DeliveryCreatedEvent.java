package ua.nure.medirepairtrack.Event.Delivery;

import ua.nure.medirepairtrack.Entity.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;

import java.math.BigDecimal;

public record DeliveryCreatedEvent(
        Integer claimId,
        Integer deliveryId,
        Integer employeeId,

        DeliveryType type,
        DeliveryProvider provider,
        DeliveryStatus status,

        String trackingCode,

        BigDecimal distanceKm,
        BigDecimal pricePerUnit,
        BigDecimal price
) {
}
