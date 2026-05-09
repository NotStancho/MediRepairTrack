package ua.nure.medirepairtrack.Event.Claim;

import ua.nure.medirepairtrack.Entity.claim.Claim.RepairType;
import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

public record ClaimCreatedEvent(
        Integer claimId,
        Integer creatorEmployeeId, // SystemEmployee.ID якщо створено клієнтом
        Integer clientId,
        RepairType repairType,
        Status status
) {
}
