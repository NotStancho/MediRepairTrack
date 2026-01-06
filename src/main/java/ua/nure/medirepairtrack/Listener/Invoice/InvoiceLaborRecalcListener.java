package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimHistory.WorkLogAddedEvent;
import ua.nure.medirepairtrack.Event.ClaimHistory.WorkLogDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimHistory.WorkLogUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimHistory.*;
import ua.nure.medirepairtrack.Service.InvoiceService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceLaborRecalcListener {

    private final InvoiceService invoiceService;

    @EventListener
    public void onWorkLogAdded(WorkLogAddedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=WORK_LOG_ADDED | claimId={} | employeeId={}",
                event.claimId(),
                event.employeeId()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onWorkLogUpdated(WorkLogUpdatedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=WORK_LOG_UPDATED | claimId={} | workLogId={} | {} → {}",
                event.claimId(),
                event.workLogId(),
                event.oldHours(),
                event.newHours()
        );

        invoiceService.recalculateLabor(event.claimId());
    }

    @EventListener
    public void onWorkLogDeleted(WorkLogDeletedEvent event) {

        log.info(
                "[EVENT] InvoiceLaborRecalc | reason=WORK_LOG_DELETED | claimId={} | workLogId={} | hours={}",
                event.claimId(),
                event.workLogId(),
                event.hours()
        );

        invoiceService.recalculateLabor(event.claimId());
    }
}


