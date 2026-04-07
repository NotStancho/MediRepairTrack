// types/diagnosis/DSS/diagnosisPrediction.ts

import type { Probability } from '../../common/valueObjects'

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

    predictedWarrantyProbability: Probability;
    confidenceScore: Probability;

    modelVersion: string;

    createdAt: string;
    updatedAt: string | null;
}
