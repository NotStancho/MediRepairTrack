package ua.nure.medirepairtrack.Listener.Delivery;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryCreatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeliveryCreatedHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onDeliveryCreated(DeliveryCreatedEvent event) {

        log.info(
                "[EVENT] DeliveryCreated | claimId={} | deliveryId={} | employeeId={} | type={} | provider={} | status={}",
                event.claimId(),
                event.deliveryId(),
                event.employeeId(),
                event.type(),
                event.provider(),
                event.status()
        );

        String description = String.format(
                "Створено доставку #%d. Тип: %s. Провайдер: %s. Статус: %s. Трек: %s",
                event.deliveryId(),
                event.type(),
                event.provider(),
                event.status(),
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
