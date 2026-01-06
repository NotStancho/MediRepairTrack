package ua.nure.medirepairtrack.Event.Delivery;

import ua.nure.medirepairtrack.Entity.Delivery.DeliveryStatus;

public record DeliveryStatusChangedEvent(
        Integer claimId,
        Integer deliveryId,
        Integer employeeId,
        DeliveryStatus oldStatus,
        DeliveryStatus newStatus
) {
}