// types/diagnosis/DSS/predictedPart.ts

import type { Probability } from '../../common/valueObjects'
import type { PartShort } from "../../part/partShort";

export interface PredictedPart {
    predictionId: number;
    part: PartShort;

    probabilityScore: Probability;
    rankPosition: number;

    createdAt: string;
}
