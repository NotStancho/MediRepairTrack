package ua.nure.medirepairtrack.Listener.claim.ClaimRepairOperation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationNoteUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimRepairOperation.ClaimRepairOperationUpdatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimRepairOperationHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onCreated(ClaimRepairOperationCreatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=CREATED | claimId={} | claimRepairOperationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Зафіксовано ремонтну роботу: %s. Виконавець: %s. Час: %s год.",
                        event.repairWorkName(),
                        event.employeeDisplayName(),
                        event.timeSpent()
                )
        );
    }

    @EventListener
    public void onUpdated(ClaimRepairOperationUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=UPDATED | claimId={} | claimRepairOperationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        String repairWorkChange = event.oldRepairWorkName().equals(event.newRepairWorkName())
                ? event.newRepairWorkName()
                : event.oldRepairWorkName() + " → " + event.newRepairWorkName();

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Оновлено ремонтну роботу: %s. Виконавець: %s. Час: %s → %s год.",
                        repairWorkChange,
                        event.employeeDisplayName(),
                        event.oldTimeSpent(),
                        event.newTimeSpent()
                )
        );
    }

    @EventListener
    public void onNoteUpdated(ClaimRepairOperationNoteUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=NOTE_UPDATED | claimId={} | claimRepairOperationId={} | performedByEmployeeId={}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.performedByEmployeeId()
        );

        String description;

        if (event.oldNote() == null && event.newNote() != null) {
            description = String.format(
                    "Додано примітку до ремонтної роботи: %s. Виконавець: %s. Додав: %s.",
                    event.repairWorkName(),
                    event.workEmployeeDisplayName(),
                    event.performedByEmployeeDisplayName()
            );
        } else if (event.newNote() == null) {
            description = String.format(
                    "Видалено примітку до ремонтної роботи: %s. Виконавець: %s. Видалив: %s.",
                    event.repairWorkName(),
                    event.workEmployeeDisplayName(),
                    event.performedByEmployeeDisplayName()
            );
        } else {
            description = String.format(
                    "Оновлено примітку до ремонтної роботи: %s. Виконавець: %s. Змінив: %s.",
                    event.repairWorkName(),
                    event.workEmployeeDisplayName(),
                    event.performedByEmployeeDisplayName()
            );
        }

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.performedByEmployeeId(),
                ActionType.WORK_LOG,
                description
        );
    }

    @EventListener
    public void onDeleted(ClaimRepairOperationDeletedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=DELETED | claimId={} | claimRepairOperationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Видалено ремонтну роботу: %s. Виконавець: %s. Час: %s год.",
                        event.repairWorkName(),
                        event.employeeDisplayName(),
                        event.timeSpent()
                )
        );
    }
}
