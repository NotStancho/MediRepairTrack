// types/diagnosis/DSS/predictedOperationPayloads.ts

export interface CreatePredictedOperationPayload {
    predictionId: number;
    repairWorkId: number;
    probabilityScore: number;
    predictedTimeSpent: number;
}

export interface UpdatePredictedOperationPayload {
    probabilityScore?: number;
    predictedTimeSpent?: number;
}
