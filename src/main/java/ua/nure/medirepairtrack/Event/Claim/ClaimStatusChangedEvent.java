package ua.nure.medirepairtrack.Event.Claim;

import ua.nure.medirepairtrack.Entity.Claim.Status;

public record ClaimStatusChangedEvent(Integer claimId, Integer employeeId, Status oldStatus, Status newStatus) {

}
