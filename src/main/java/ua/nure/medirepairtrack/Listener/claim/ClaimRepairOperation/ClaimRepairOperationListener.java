package ua.nure.medirepairtrack.Listener.claim.ClaimRepairOperation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationUpdatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimEmployeeService;
import ua.nure.medirepairtrack.Service.claim.ClaimService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimRepairOperationListener {

    private final ClaimService claimService;
    private final ClaimEmployeeService claimEmployeeService;

    @EventListener
    public void onCreated(ClaimRepairOperationCreatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationCreated | claimId={} | operationId={} | employeeId={} | timeSpent={}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.employeeId(),
                event.timeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }

    @EventListener
    public void onUpdated(ClaimRepairOperationUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationUpdated | claimId={} | operationId={} | employeeId={} | {} -> {}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.employeeId(),
                event.oldTimeSpent(),
                event.newTimeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }

    @EventListener
    public void onDeleted(ClaimRepairOperationDeletedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationDeleted | claimId={} | operationId={} | employeeId={} | timeSpent={}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.employeeId(),
                event.timeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }
}