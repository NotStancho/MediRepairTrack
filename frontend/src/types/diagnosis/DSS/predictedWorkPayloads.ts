// types/diagnosis/DSS/predictedWorkPayloads.ts

export interface CreatePredictedWorkPayload {
    predictionId: number;
    repairWorkId: number;
    probabilityScore: number;
    predictedTimeSpent: number;
}

export interface UpdatePredictedWorkPayload {
    probabilityScore?: number;
    predictedTimeSpent?: number;
}
