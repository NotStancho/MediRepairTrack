package ua.nure.medirepairtrack.Event.ClaimEmployee;

import ua.nure.medirepairtrack.Entity.claim.ClaimEmployee.RoleInClaim;

public record ClaimEmployeeAssignedEvent(
        Integer claimId,
        Integer managerId,
        Integer employeeId,
        RoleInClaim role
) {}
