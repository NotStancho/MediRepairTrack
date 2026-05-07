package ua.nure.medirepairtrack.Listener.claim.ClaimHistory;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.ClaimEmployee.ClaimEmployeeAssignedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimEmployeeAssignmentListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onEmployeeAssigned(ClaimEmployeeAssignedEvent event) {

        log.info("[EVENT] EmployeeAssigned | claimId={} | description={}", event.claimId(), event.description());

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.performedByEmployeeId(),
                ActionType.EMPLOYEE_ASSIGNMENT,
                event.description()
        );
    }
}

