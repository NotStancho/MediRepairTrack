package ua.nure.medirepairtrack.Event.ClaimWork;

public record ClaimWorkNoteUpdatedEvent(
        Integer claimId,
        Integer claimWorkId,
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
