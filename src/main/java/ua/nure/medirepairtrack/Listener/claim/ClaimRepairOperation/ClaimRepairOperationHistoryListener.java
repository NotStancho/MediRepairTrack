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
                "[EVENT] ClaimRepairOperationHistory | action=CREATED | claimId={} | operationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Зафіксовано ремонтну роботу: %s. Виконавець: %s. Час: %s год.",
                        event.repairOperationName(),
                        event.employeeDisplayName(),
                        event.timeSpent()
                )
        );
    }

    @EventListener
    public void onUpdated(ClaimRepairOperationUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=UPDATED | claimId={} | operationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        String operationChange = event.oldRepairOperationName().equals(event.newRepairOperationName())
                ? event.newRepairOperationName()
                : event.oldRepairOperationName() + " → " + event.newRepairOperationName();

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Оновлено ремонтну роботу: %s. Виконавець: %s. Час: %s → %s год.",
                        operationChange,
                        event.employeeDisplayName(),
                        event.oldTimeSpent(),
                        event.newTimeSpent()
                )
        );
    }

    @EventListener
    public void onNoteUpdated(ClaimRepairOperationNoteUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimRepairOperationHistory | action=NOTE_UPDATED | claimId={} | operationId={} | performedByEmployeeId={}",
                event.claimId(),
                event.claimRepairOperationId(),
                event.performedByEmployeeId()
        );

        String description;

        if (event.oldNote() == null && event.newNote() != null) {
            description = String.format(
                    "Додано примітку до ремонтної роботи: %s. Виконавець: %s. Додав: %s.",
                    event.repairOperationName(),
                    event.workEmployeeDisplayName(),
                    event.performedByEmployeeDisplayName()
            );
        } else if (event.newNote() == null) {
            description = String.format(
                    "Видалено примітку до ремонтної роботи: %s. Виконавець: %s. Видалив: %s.",
                    event.repairOperationName(),
                    event.workEmployeeDisplayName(),
                    event.performedByEmployeeDisplayName()
            );
        } else {
            description = String.format(
                    "Оновлено примітку до ремонтної роботи: %s. Виконавець: %s. Змінив: %s.",
                    event.repairOperationName(),
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
                "[EVENT] ClaimRepairOperationHistory | action=DELETED | claimId={} | operationId={}",
                event.claimId(),
                event.claimRepairOperationId()
        );

        claimHistoryService.addSystemEvent(
                event.claimId(),
                event.employeeId(),
                ActionType.WORK_LOG,
                String.format(
                        "Видалено ремонтну роботу: %s. Виконавець: %s. Час: %s год.",
                        event.repairOperationName(),
                        event.employeeDisplayName(),
                        event.timeSpent()
                )
        );
    }
}
