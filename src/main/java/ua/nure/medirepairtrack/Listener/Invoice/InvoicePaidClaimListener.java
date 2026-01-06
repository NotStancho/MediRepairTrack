package ua.nure.medirepairtrack.Listener.Invoice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.Invoice.InvoicePaidEvent;
import ua.nure.medirepairtrack.Service.ClaimService;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoicePaidClaimListener {

    private final ClaimService claimService;

    @EventListener
    public void onInvoicePaid(InvoicePaidEvent event) {
        log.info("[EVENT] InvoicePaid → try complete claim {}", event.claimId());
        claimService.tryCompleteClaim(event.claimId());
    }
}

