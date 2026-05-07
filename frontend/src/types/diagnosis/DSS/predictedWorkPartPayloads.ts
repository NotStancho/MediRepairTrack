// types/diagnosis/DSS/predictedWorkPartPayloads.ts

export interface CreatePredictedWorkPartPayload {
    predictionId: number;
    repairWorkId: number;
    partId: number;
    predictedQuantity: number;
    probabilityScore: number;
}

export interface UpdatePredictedWorkPartPayload {
    predictedQuantity?: number;
    probabilityScore?: number;
}
