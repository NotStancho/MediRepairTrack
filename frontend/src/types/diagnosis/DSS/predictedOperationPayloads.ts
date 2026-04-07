// types/diagnosis/DSS/predictedOperationPayloads.ts

export interface CreatePredictedOperationPayload {
    predictionId: number;
    operationId: number;
    probabilityScore: number;
    predictedTimeSpent: number;
}

export interface UpdatePredictedOperationPayload {
    probabilityScore?: number;
    predictedTimeSpent?: number;
}