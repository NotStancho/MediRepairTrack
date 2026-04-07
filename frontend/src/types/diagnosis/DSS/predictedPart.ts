// types/diagnosis/DSS/predictedPart.ts

import type { Probability } from '../../common/valueObjects'

export interface PredictedPart {
    predictionId: number;
    partId: number;

    probabilityScore: Probability;
    rankPosition: number;

    createdAt: string;
}
