package ua.nure.medirepairtrack.Listener.Delivery;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryUpdatedEvent;
import ua.nure.medirepairtrack.Service.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeliveryUpdatedHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onDeliveryUpdated(DeliveryUpdatedEvent event) {

        log.info(
                "[EVENT] DeliveryUpdated | claimId={} | deliveryId={} | employeeId={} | type={} | provider={} | tracking={}",
                event.claimId(),
                event.deliveryId(),
                event.employeeId(),
                event.type(),
                event.provider(),
                event.trackingCode()
        );

        String description = String.format(
                "Оновлено доставку #%d. Тип: %s. Провайдер: %s. Трек: %s",
                event.deliveryId(),
                event.type(),
                event.provider(),
                event.trackingCode() != null ? event.trackingCode() : "-"
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.DELIVERY_EVENT,
                description
        );
    }
}
