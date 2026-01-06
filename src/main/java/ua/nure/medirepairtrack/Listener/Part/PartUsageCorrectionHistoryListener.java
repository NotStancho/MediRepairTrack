package ua.nure.medirepairtrack.Listener.Part;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.Part.PartUsageUpdatedEvent;
import ua.nure.medirepairtrack.Service.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class PartUsageCorrectionHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onPartUsageCorrected(PartUsageUpdatedEvent event) {

        log.info(
                "[EVENT] PartUsageCorrected | claimId={} | part={} ({}) | {} → {} {} | delta={}",
                event.claimId(),
                event.partName(),
                event.partCode(),
                event.oldQuantity(),
                event.newQuantity(),
                event.unitName(),
                event.delta()
        );

        String description = String.format(
                "Корекція використання запчастини: %s (%s). Було: %s %s, стало: %s %s",
                event.partName(),
                event.partCode(),
                event.oldQuantity(),
                event.unitName(),
                event.newQuantity(),
                event.unitName()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.PART_USED,
                description
        );
    }
}
