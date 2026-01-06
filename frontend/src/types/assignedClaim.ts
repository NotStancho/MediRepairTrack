import type { RepairType, ClaimStatus } from './claim';

export type RoleInClaim =
    | 'LEAD'
    | 'ASSISTANT'
    | 'DIAGNOSTIC'
    | 'INSTALLER'
    | 'EXPERT';

export interface AssignedActiveClaim {
    claimId: number;
    clientId: number;

    status: ClaimStatus;
    repairType: RepairType;

    role: RoleInClaim;

    hoursWorked: number;
    totalTimeSpent: number;

    createdAt: string;
    closedAt: string | null;

    defectDescription: string;
}
