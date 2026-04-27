package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationUpdatedEvent;
import ua.nure.medirepairtrack.Service.billing.InvoiceService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceLaborRecalcListener {

    private final InvoiceService invoiceService;

    @EventListener
    public void onCreated(ClaimRepairOperationCreatedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_REPAIR_OPERATION_CREATED | claimId={} | operationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onUpdated(ClaimRepairOperationUpdatedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_REPAIR_OPERATION_UPDATED | claimId={} | operationId={} | {} -> {}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.oldTimeSpent(),
                event.newTimeSpent()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onDeleted(ClaimRepairOperationDeletedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_REPAIR_OPERATION_DELETED | claimId={} | operationId={} | timeSpent={}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.timeSpent()
        );

        invoiceService.recalculateLabor(event.claimId());
    }
}
