// types/claim/claimRepairOperationPayloads

export interface CreateClaimRepairOperationPayload {
    claimId: number;
    repairWorkId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimRepairOperationPayload {
    repairWorkId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimRepairOperationNotePayload {
    note?: string | null;
}
