package ua.nure.medirepairtrack.Listener.claim.ClaimWork;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ua.nure.medirepairtrack.Entity.claim.ClaimHistory.ActionType;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkCreatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkDeletedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkNoteUpdatedEvent;
import ua.nure.medirepairtrack.Event.ClaimWork.ClaimWorkUpdatedEvent;
import ua.nure.medirepairtrack.Service.claim.ClaimHistoryService;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClaimWorkHistoryListener {

    private final ClaimHistoryService claimHistoryService;

    @EventListener
    public void onCreated(ClaimWorkCreatedEvent event) {

        log.info(
                "[EVENT] ClaimWorkHistory | action=CREATED | claimId={} | claimWorkId={}",
                event.claimId(),
                event.claimWorkId()
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
    public void onUpdated(ClaimWorkUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimWorkHistory | action=UPDATED | claimId={} | claimWorkId={}",
                event.claimId(),
                event.claimWorkId()
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
    public void onNoteUpdated(ClaimWorkNoteUpdatedEvent event) {

        log.info(
                "[EVENT] ClaimWorkHistory | action=NOTE_UPDATED | claimId={} | claimWorkId={} | performedByEmployeeId={}",
                event.claimId(),
                event.claimWorkId(),
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
    public void onDeleted(ClaimWorkDeletedEvent event) {

        log.info(
                "[EVENT] ClaimWorkHistory | action=DELETED | claimId={} | claimWorkId={}",
                event.claimId(),
                event.claimWorkId()
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
