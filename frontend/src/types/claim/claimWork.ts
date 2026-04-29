// types/claim/claimWork

export interface ClaimWork {
    id: number;
    claimId: number;
    repairWorkId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
    createdAt: string;
    updatedAt?: string | null;
}
