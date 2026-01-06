package ua.nure.medirepairtrack.Event.Claim;

import ua.nure.medirepairtrack.Entity.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.Claim.Status;

public record ClaimCreatedEvent(
        Integer claimId,
        Integer creatorEmployeeId, // може бути null (якщо клієнт)
        Integer clientId,
        RepairType repairType,
        Status status
) {
}
