// types/claim/claimRepairOperation

export interface ClaimRepairOperation {
    id: number;
    claimId: number;
    operationId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}