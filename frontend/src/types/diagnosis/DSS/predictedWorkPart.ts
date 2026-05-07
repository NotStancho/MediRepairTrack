// types/diagnosis/DSS/predictedWorkPart.ts

import type { Probability } from '../../common/valueObjects'
import type { PartShort } from "../../part/partShort";

export interface PredictedWorkPart {
    predictionId: number;
    repairWorkId: number;
    part: PartShort;

    predictedQuantity: number;
    probabilityScore: Probability;
    rankPosition: number;

    createdAt: string;
}
