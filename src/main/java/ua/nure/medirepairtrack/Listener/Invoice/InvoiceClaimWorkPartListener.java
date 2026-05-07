package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartRemovedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartAddedEvent;
import ua.nure.medirepairtrack.Service.billing.InvoiceService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceClaimWorkPartListener {

    private final InvoiceService invoiceService;

    @EventListener
    public void onClaimWorkPartAdded(ClaimWorkPartAddedEvent event) {
        log.info(
                "[EVENT] InvoicePartsRecalc | reason=CLAIM_WORK_PART_ADDED | claimId={} | claimWorkId={} | part={} ({}) | qty={}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.quantity()
        );

        invoiceService.recalculateParts(event.claimId());
    }

    @EventListener
    public void onClaimWorkPartUpdated(ClaimWorkPartUpdatedEvent event) {
        log.info(
                "[EVENT] InvoicePartsRecalc | reason=CLAIM_WORK_PART_UPDATED | claimId={} | claimWorkId={} | part={} ({}) | {} → {} | delta={}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.oldQuantity(),
                event.newQuantity(),
                event.delta()
        );

        invoiceService.recalculateParts(event.claimId());
    }

    @EventListener
    public void onClaimWorkPartRemoved(ClaimWorkPartRemovedEvent event) {
        log.info(
                "[EVENT] InvoicePartsRecalc | reason=CLAIM_WORK_PART_REMOVED | claimId={} | claimWorkId={} | part={} ({}) | removedQty={}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.removedQuantity()
        );

        invoiceService.recalculateParts(event.claimId());
    }
}
