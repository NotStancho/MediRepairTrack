// types/claim/claimRepairOperationPayloads

export interface CreateClaimRepairOperationPayload {
    claimId: number;
    operationId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimRepairOperationPayload {
    operationId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimRepairOperationNotePayload {
    note?: string | null;
}
