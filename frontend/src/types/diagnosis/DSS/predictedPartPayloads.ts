// types/diagnosis/DSS/predictedPartPayloads.ts

export interface CreatePredictedPartPayload {
    predictionId: number;
    partId: number;
    probabilityScore: number;
}

export interface UpdatePredictedPartPayload {
    probabilityScore?: number;
}