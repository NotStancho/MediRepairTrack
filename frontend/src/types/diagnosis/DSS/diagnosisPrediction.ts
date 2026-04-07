// types/diagnosis/DSS/diagnosisPrediction.ts

export type PredictionSource =
    | 'AUTOMATED'
    | 'MANUAL'
    | 'HYBRID';

export interface DiagnosisPrediction {
    id: number;
    diagnosisId: number;

    predictedComplexityLevelId: number;

    predictionSource: PredictionSource;

    predictedCost: number;
    predictedTimeHours: number;
    predictionExplanation: string;

    predictedWarrantyProbability: number;
    confidenceScore: number;

    modelVersion: string;

    createdAt: string;
    updatedAt: string | null;
}
