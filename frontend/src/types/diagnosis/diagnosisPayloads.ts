// types/diagnosis/diagnosisPayloads.ts

import type { SimilaritySearchMode } from './DSS/similaritySearchMode';

export interface CreateAutoDiagnosisPayload {
    claimId: number;
    similaritySearchMode?: SimilaritySearchMode;
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