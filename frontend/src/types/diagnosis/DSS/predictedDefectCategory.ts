// types/diagnosis/DSS/predictedDefectCategory.ts

import type { Probability } from '../../common/valueObjects'
import type { DefectCategoryShort } from '../../defectCategory/defectCategoryShort';

export interface PredictedDefectCategory {
    predictionId: number;
    defectCategory: DefectCategoryShort;

    probabilityScore: Probability;
    rankPosition: number;

    createdAt: string;
}