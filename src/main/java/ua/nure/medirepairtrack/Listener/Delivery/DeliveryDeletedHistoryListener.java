package ua.nure.medirepairtrack.Listener.Delivery;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryDeletedEvent;
import ua.nure.medirepairtrack.Service.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeliveryDeletedHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onDeliveryDeleted(DeliveryDeletedEvent event) {

        log.info(
                "[EVENT] DeliveryDeleted | claimId={} | deliveryId={} | employeeId={} | type={} | provider={}",
                event.claimId(),
                event.deliveryId(),
                event.employeeId(),
                event.type(),
                event.provider()
        );

        String description = String.format(
                "Видалено доставку #%d. Тип: %s. Провайдер: %s",
                event.deliveryId(),
                event.type(),
                event.provider()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.DELIVERY_EVENT,
                description
        );
    }
}
