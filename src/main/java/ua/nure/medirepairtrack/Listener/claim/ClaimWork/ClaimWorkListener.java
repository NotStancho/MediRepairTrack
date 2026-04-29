package ua.nure.medirepairtrack.Listener.claim.ClaimWork;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkUpdatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimEmployeeService;
import ua.nure.medirepairtrack.Service.claim.ClaimService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimWorkListener {

    private final ClaimService claimService;
    private final ClaimEmployeeService claimEmployeeService;

    @EventListener
    public void onCreated(ClaimWorkCreatedEvent event) {

        log.info(
                "[EVENT] ClaimWorkCreated | claimId={} | claimWorkId={} | employeeId={} | timeSpent={}",
                event.claimId(),
                event.claimWorkId(),
                event.employeeId(),
                event.timeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }

    @EventListener
    public void onUpdated(ClaimWorkUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimWorkUpdated | claimId={} | claimWorkId={} | employeeId={} | {} -> {}",
                event.claimId(),
                event.claimWorkId(),
                event.employeeId(),
                event.oldTimeSpent(),
                event.newTimeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }

    @EventListener
    public void onDeleted(ClaimWorkDeletedEvent event) {

        log.info(
                "[EVENT] ClaimWorkDeleted | claimId={} | claimWorkId={} | employeeId={} | timeSpent={}",
                event.claimId(),
                event.claimWorkId(),
                event.employeeId(),
                event.timeSpent()
        );

        claimService.recalculateTotalTimeSpent(event.claimId());
        claimEmployeeService.recalculateHours(event.claimId(), event.employeeId());
    }
}
