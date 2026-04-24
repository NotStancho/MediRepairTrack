// types/claim/claimEmployeePayloads

import type { RoleInClaim } from './assignedClaim';

export interface AssignEmployeeToClaimPayload {
    performedByEmployeeId: number;
    employeeId: number;
    role: RoleInClaim;
}

export interface UpdateClaimEmployeePayload {
    performedByEmployeeId: number;
    roleInClaim: RoleInClaim;
}
