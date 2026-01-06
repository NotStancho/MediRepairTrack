package ua.nure.medirepairtrack.Event.Delivery;

import ua.nure.medirepairtrack.Entity.Delivery.DeliveryProvider;
import ua.nure.medirepairtrack.Entity.Delivery.DeliveryType;

public record DeliveryDeletedEvent(
        Integer claimId,
        Integer deliveryId,
        Integer employeeId,

        DeliveryType type,
        DeliveryProvider provider
) {
}
