package ua.nure.medirepairtrack.Event.Claim;

import ua.nure.medirepairtrack.Entity.claim.Claim.Status;

public record ClaimStatusChangedEvent(Integer claimId, Integer employeeId, Status oldStatus, Status newStatus) {

}
