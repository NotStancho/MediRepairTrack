// types/claim/claimEmployeePayloads

import type { RoleInClaim } from './assignedClaim';

export interface AssignEmployeeToClaimPayload {
    performedByEmployeeId: number;
    employeeId: number;
    role: RoleInClaim;
    notes?: string | null;
}

export interface UpdateClaimEmployeePayload {
    performedByEmployeeId: number;
    roleInClaim: RoleInClaim;
    notes?: string | null;
}
