package ua.nure.medirepairtrack.Listener.Claim;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
// import org.springframework.transaction.event.TransactionalEventListener;
import ua.nure.medirepairtrack.Entity.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.InvoiceService;

// import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimAcceptedBillingListener {

    private final InvoiceService invoiceService;

    // @TransactionalEventListener(phase = AFTER_COMMIT)
    @EventListener
    public void onClaimStatusChanged(ClaimStatusChangedEvent event) {

        if (event.oldStatus() != Status.ACCEPTED && event.newStatus() == Status.ACCEPTED) {

            log.info("[EVENT] ClaimAccepted | claimId={} | billing=triggered", event.claimId());

            invoiceService.createDraft(event.claimId());
        }
    }
}
