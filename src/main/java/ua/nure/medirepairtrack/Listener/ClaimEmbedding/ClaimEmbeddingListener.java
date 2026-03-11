package ua.nure.medirepairtrack.Listener.ClaimEmbedding;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.Claim.Claim;
import ua.nure.medirepairtrack.Entity.Claim.Status;
import ua.nure.medirepairtrack.Event.Claim.ClaimDescriptionChangedEvent;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.ClaimService;
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
