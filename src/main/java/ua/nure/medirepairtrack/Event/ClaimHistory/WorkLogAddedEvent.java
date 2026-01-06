package ua.nure.medirepairtrack.Event.ClaimHistory;

public record WorkLogAddedEvent(
        Integer claimId,
        Integer employeeId
) {}
