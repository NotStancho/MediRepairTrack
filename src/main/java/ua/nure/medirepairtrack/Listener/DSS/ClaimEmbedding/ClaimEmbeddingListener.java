package ua.nure.medirepairtrack.Listener.DSS.ClaimEmbedding;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import ua.nure.medirepairtrack.Event.Claim.ClaimDescriptionChangedEvent;
import ua.nure.medirepairtrack.Service.DSS.EmbeddingService;

import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimEmbeddingListener {

    private final EmbeddingService embeddingService;

    @Async
    @TransactionalEventListener(phase = AFTER_COMMIT)
    public void handleDescriptionChanged(ClaimDescriptionChangedEvent event) {
        log.info("[EVENT] ClaimDescriptionChanged | claimId={} | embedding=triggered", event.claimId());

        embeddingService.regenerateEmbedding(event.claimId());
    }
}
