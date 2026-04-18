package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryCreatedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryDeletedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryStatusChangedEvent;
import ua.nure.medirepairtrack.Event.Delivery.DeliveryUpdatedEvent;
import ua.nure.medirepairtrack.Service.billing.InvoiceService;
import ua.nure.medirepairtrack.Workflow.DeliveryStatusMachine;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceDeliveryRecalcListener {

    private final InvoiceService invoiceService;
    private final DeliveryStatusMachine deliveryStatusMachine;

    @EventListener
    public void onDeliveryCreated(DeliveryCreatedEvent event) {

        log.info(
                "[EVENT] InvoiceDeliveryRecalc | reason=DELIVERY_CREATED | claimId={} | deliveryId={}",
                event.claimId(),
                event.deliveryId()
        );

        invoiceService.recalculateDelivery(event.claimId());
    }

    @EventListener
    public void onDeliveryDeleted(DeliveryDeletedEvent event) {

        log.info(
                "[EVENT] InvoiceDeliveryRecalc | reason=DELIVERY_DELETED | claimId={} | deliveryId={}",
                event.claimId(),
                event.deliveryId()
        );

        invoiceService.recalculateDelivery(event.claimId());
    }

    @EventListener
    public void onDeliveryUpdated(DeliveryUpdatedEvent event) {

        log.info(
                "[EVENT] InvoiceDeliveryRecalc | reason=DELIVERY_UPDATED | claimId={} | deliveryId={}",
                event.claimId(),
                event.deliveryId()
        );

        invoiceService.recalculateDelivery(event.claimId());
    }

    @EventListener
    public void onDeliveryStatusChanged(DeliveryStatusChangedEvent event) {

        boolean wasBillable = deliveryStatusMachine.isBillable(event.oldStatus());
        boolean isBillable  = deliveryStatusMachine.isBillable(event.newStatus());

        if (wasBillable != isBillable) {

            log.info(
                    "[EVENT] InvoiceDeliveryRecalc | reason=DELIVERY_STATUS_CHANGED | claimId={} | {} → {}",
                    event.claimId(),
                    event.oldStatus(),
                    event.newStatus()
            );

            invoiceService.recalculateDelivery(event.claimId());
        }
    }
}

