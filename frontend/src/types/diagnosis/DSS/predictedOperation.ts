// types/diagnosis/DSS/predictedOperation.ts

import type { Probability } from '../../common/valueObjects'

export interface PredictedOperation {
    predictionId: number;
    operationId: number;

    probabilityScore: Probability;
    rankPosition: number;

    predictedTimeSpent: number;

    createdAt: string;
}