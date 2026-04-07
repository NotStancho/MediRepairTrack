// types/diagnosis/DSS/predictedOperation.ts

export interface PredictedOperation {
    predictionId: number;
    operationId: number;

    probabilityScore: number;
    rankPosition: number;

    predictedTimeSpent: number;

    createdAt: string;
}