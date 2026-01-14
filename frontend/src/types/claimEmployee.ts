import type { RoleInClaim } from './claim/assignedClaim.ts';

export interface ClaimEmployee {
    employeeId: number;
    firstName: string;
    lastName: string;
    position: string;
    roleInClaim: RoleInClaim;
    hoursWorked: number;
    ratePerHour: number;
    notes?: string;
}
