// types/claim/claimRepairOperation

export interface ClaimRepairOperation {
    id: number;
    claimId: number;
    repairWorkId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}
