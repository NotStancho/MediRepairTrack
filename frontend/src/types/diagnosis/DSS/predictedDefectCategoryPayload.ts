// types/diagnosis/DSS/predictedDefectPayload.ts

export interface CreatePredictedDefectPayload {
    predictionId: number;
    defectCategoryId: number;
    probabilityScore: number;
}

export interface UpdatePredictedDefectPayload {
    probabilityScore?: number;
}