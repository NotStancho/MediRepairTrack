export type RoleInClaim =
    | 'LEAD'
    | 'ASSISTANT'
    | 'DIAGNOSTIC'
    | 'INSTALLER'
    | 'EXPERT';

export interface AssignedClaim {
    claimId: number;
    status: string;
    role: RoleInClaim;
    hoursWorked: number;
}

export interface AssignedActiveClaim extends AssignedClaim {
    clientId: number;
    repairType: string;
    totalTimeSpent: number;
    createdAt: string;
    closedAt?: string;
    defectDescription: string;
}
