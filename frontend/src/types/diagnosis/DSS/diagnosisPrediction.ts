// types/diagnosis/DSS/diagnosisPrediction.ts

import type { Probability } from '../../common/valueObjects'
import type { ComplexityLevelShort } from './complexityLevel';

export type PredictionSource =
    | 'AUTOMATED'
    | 'MANUAL'
    | 'HYBRID';

export interface DiagnosisPrediction {
    id: number;
    diagnosisId: number;

    predictedComplexityLevel: ComplexityLevelShort;

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
