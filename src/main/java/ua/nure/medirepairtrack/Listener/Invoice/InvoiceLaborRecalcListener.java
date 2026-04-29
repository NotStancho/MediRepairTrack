package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkUpdatedEvent;
import ua.nure.medirepairtrack.Service.billing.InvoiceService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceLaborRecalcListener {

    private final InvoiceService invoiceService;

    @EventListener
    public void onCreated(ClaimWorkCreatedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_WORK_CREATED | claimId={} | claimWorkId={}",
                event.claimId(),
                event.claimWorkId()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onUpdated(ClaimWorkUpdatedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_WORK_UPDATED | claimId={} | claimWorkId={} | {} -> {}",
                event.claimId(),
                event.claimWorkId(),
                event.oldTimeSpent(),
                event.newTimeSpent()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onDeleted(ClaimWorkDeletedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=CLAIM_WORK_DELETED | claimId={} | claimWorkId={} | timeSpent={}",
                event.claimId(),
                event.claimWorkId(),
                event.timeSpent()
        );

        invoiceService.recalculateLabor(event.claimId());
    }
}
