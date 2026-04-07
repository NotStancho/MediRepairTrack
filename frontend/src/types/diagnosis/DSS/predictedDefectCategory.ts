// types/diagnosis/DSS/predictedDefectCategory.ts

import type { Probability } from '../../common/valueObjects'

export interface PredictedDefectCategory {
    predictionId: number;
    defectCategoryId: number;

    probabilityScore: Probability;
    rankPosition: number;

    createdAt: string;
}