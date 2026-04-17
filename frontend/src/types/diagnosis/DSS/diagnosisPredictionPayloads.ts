// types/diagnosis/DSS/diagnosisPredictionPayloads.ts

export interface CreateManualPredictionPayload {
    diagnosisId: number;
    predictedComplexityLevelId: number;
    predictedCost?: number;
    predictedTimeHours?: number;
    predictionExplanation: string;
}

export interface UpdatePredictionPayload {
    predictedComplexityLevelId?: number;
    predictedCost?: number;
    predictedTimeHours?: number;
    predictionExplanation?: string;
}