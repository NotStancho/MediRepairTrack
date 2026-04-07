// types/diagnosis/DSS/predictedPart.ts

export interface PredictedPart {
    predictionId: number;
    partId: number;

    probabilityScore: number;
    rankPosition: number;

    createdAt: string;
}
