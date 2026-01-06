package ua.nure.medirepairtrack.Listener.Claim;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Claim.ClaimStatusChangedEvent;
import ua.nure.medirepairtrack.Service.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimStatusHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onStatusChanged(ClaimStatusChangedEvent event) {

        log.info(
                "[EVENT] ClaimStatusChanged | claimId={} | {} → {} | by employee={}",
                event.claimId(),
                event.oldStatus(),
                event.newStatus(),
                event.employeeId()
        );

        String description = String.format(
                "Статус заявки змінено: %s → %s", event.oldStatus(), event.newStatus()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.STATUS_CHANGE,
                description
        );
    }
}

