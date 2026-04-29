package ua.nure.medirepairtrack.Event.ClaimRepairOperation;

public record ClaimRepairOperationNoteUpdatedEvent(
        Integer claimId,
        Integer claimRepairOperationId,
        Integer workEmployeeId,
        String workEmployeeDisplayName,
        Integer performedByEmployeeId,
        String performedByEmployeeDisplayName,
        Integer repairWorkId,
        String repairWorkName,
        String oldNote,
        String newNote
) {
}
