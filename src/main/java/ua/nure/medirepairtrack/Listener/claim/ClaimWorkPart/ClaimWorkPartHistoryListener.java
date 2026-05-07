package ua.nure.medirepairtrack.Listener.claim.ClaimWorkPart;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartAddedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartRemovedEvent;
import ua.nure.medirepairtrack.Event.ClaimWorkPart.ClaimWorkPartUpdatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimWorkPartHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onClaimWorkPartAdded(ClaimWorkPartAddedEvent event) {
        log.info(
                "[EVENT] ClaimWorkPartHistory | action=ADDED | claimId={} | claimWorkId={} | part={} ({}) | qty={} {}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.quantity(),
                event.unitName()
        );

        String description = String.format(
                "До роботи \"%s\" додано запчастину: %s (%s). Кількість: %s %s",
                event.repairWorkName(),
                event.partName(),
                event.partCode(),
                event.quantity(),
                event.unitName()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.PART_USED,
                description
        );
    }

    @EventListener
    public void onClaimWorkPartUpdated(ClaimWorkPartUpdatedEvent event) {
        log.info(
                "[EVENT] ClaimWorkPartHistory | action=UPDATED | claimId={} | claimWorkId={} | part={} ({}) | {} → {} {} | delta={}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.oldQuantity(),
                event.newQuantity(),
                event.unitName(),
                event.delta()
        );

        String description = String.format(
                "У роботі \"%s\" оновлено кількість запчастини: %s (%s). Було: %s %s, стало: %s %s",
                event.repairWorkName(),
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

    @EventListener
    public void onClaimWorkPartRemoved(ClaimWorkPartRemovedEvent event) {
        log.info(
                "[EVENT] ClaimWorkPartHistory | action=REMOVED | claimId={} | claimWorkId={} | part={} ({}) | removedQty={} {}",
                event.claimId(),
                event.claimWorkId(),
                event.partName(),
                event.partCode(),
                event.removedQuantity(),
                event.unitName()
        );

        String description = String.format(
                "З роботи \"%s\" видалено запчастину: %s (%s). Повернено на склад: %s %s",
                event.repairWorkName(),
                event.partName(),
                event.partCode(),
                event.removedQuantity(),
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
