package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Const.SystemEmployee;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Invoice.InvoiceOverdueEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceOverdueHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onInvoiceOverdue(InvoiceOverdueEvent event) {

        Integer actorEmployeeId = SystemEmployee.ID;

        String description = "Рахунок прострочений (OVERDUE)";

        log.warn(
                "[EVENT] InvoiceOverdue | invoiceId={} | claimId={}",
                event.invoiceId(),
                event.claimId()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                actorEmployeeId,
                ActionType.SYSTEM_EVENT,
                description
        );
    }
}