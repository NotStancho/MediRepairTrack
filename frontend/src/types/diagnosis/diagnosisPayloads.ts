// types/diagnosis/diagnosisPayloads.ts

export interface CreateAutoDiagnosisPayload {
    claimId: number;
}

export interface CreateManualDiagnosisPayload {
    claimId: number;
    engineerId: number;
    preliminaryConclusion?: string;
    estimatedCost?: number;
    estimatedTimeHours?: number;
}

export interface UpdateDiagnosisPayload {
    preliminaryConclusion?: string;
    finalConclusion?: string;
    estimatedCost?: number;
    estimatedTimeHours?: number;
}