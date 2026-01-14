export type ClaimStatus =
    | 'NEW'
    | 'IN_REVIEW'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'ASSIGNED_TO_ENGINEER'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_PARTS'
    | 'COMPLETED'
    | 'CANCELED';

export type RepairType =
    | 'WAITING_DECISION'
    | 'WARRANTY_REPAIR'
    | 'POST_WARRANTY_REPAIR'
    | 'DIAGNOSTIC'
    | 'PREVENTIVE_REPAIR'
    | 'URGENT_REPAIR'
    | 'INSTALLATION'
    | 'CALIBRATION'
    | 'MAINTENANCE';


export interface Claim {
    id: number;
    clientId: number;
    equipmentId: number;
    repairType: RepairType;
    status: ClaimStatus;
    defectDescription: string;
    totalTimeSpent: number | null;
    createdAt: string;
    closedAt: string | null;
}