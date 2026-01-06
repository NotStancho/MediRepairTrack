package ua.nure.medirepairtrack.Listener.ClaimEmployee;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Event.ClaimHistory.WorkLogAddedEvent;
import ua.nure.medirepairtrack.Service.ClaimEmployeeService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimEmployeeWorkLogListener {

    private final ClaimEmployeeService claimEmployeeService;

    @EventListener
    public void onWorkLogAdded(WorkLogAddedEvent event) {

        log.info(
                "[EVENT] WorkLogAdded | claimId={} | employeeId={}",
                event.claimId(),
                event.employeeId()
        );

        claimEmployeeService.recalculateHours(
                event.claimId(),
                event.employeeId()
        );
    }
}
