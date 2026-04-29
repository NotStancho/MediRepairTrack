// types/claim/claimWorkPayloads

export interface CreateClaimWorkPayload {
    claimId: number;
    repairWorkId: number;
    employeeId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimWorkPayload {
    repairWorkId: number;
    timeSpent: number;
    note?: string | null;
}

export interface UpdateClaimWorkNotePayload {
    note?: string | null;
}
