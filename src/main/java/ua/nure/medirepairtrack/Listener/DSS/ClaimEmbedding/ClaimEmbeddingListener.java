package ua.nure.medirepairtrack.Listener.DSS.ClaimEmbedding;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.Claim.Claim;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimDescriptionChangedEvent;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimService;
import ua.nure.medirepairtrack.Service.DSS.EmbeddingService;

@Component
@RequiredArgsConstructor
public class ClaimEmbeddingListener {

    private final EmbeddingService embeddingService;
    private final ClaimService claimService;

    @EventListener
    public void handleStatusChange(ClaimStatusChangedEvent event) {

        if (event.newStatus() == Status.ACCEPTED) {

            Claim claim = claimService.getClaim(event.claimId());

            embeddingService.generateIfMissing(claim);
        }
    }

    @EventListener
    public void handleDescriptionChanged(ClaimDescriptionChangedEvent event) {

        Claim claim = claimService.getClaim(event.claimId());

        embeddingService.regenerateEmbedding(claim);
    }
}
