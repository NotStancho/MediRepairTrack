package ua.nure.medirepairtrack.Listener.Delivery;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryStatusChangedEvent;
import ua.nure.medirepairtrack.Service.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeliveryStatusChangedHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onDeliveryStatusChanged(DeliveryStatusChangedEvent event) {

        log.info(
                "[EVENT] DeliveryStatusChanged | claimId={} | deliveryId={} | employeeId={} | {} -> {}",
                event.claimId(),
                event.deliveryId(),
                event.employeeId(),
                event.oldStatus(),
                event.newStatus()
        );

        String description = String.format(
                "Зміна статусу доставки #%d: %s → %s",
                event.deliveryId(),
                event.oldStatus(),
                event.newStatus()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.DELIVERY_EVENT,
                description
        );
    }
}
