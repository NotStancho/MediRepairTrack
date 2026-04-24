package ua.nure.medirepairtrack.Event.ClaimEmployee;

public record ClaimEmployeeAssignedEvent(
        Integer claimId,
        Integer performedByEmployeeId,
        String description
) {}
