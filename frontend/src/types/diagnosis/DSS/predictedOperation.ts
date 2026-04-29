// types/diagnosis/DSS/predictedOperation.ts
import type { RepairWorkShort } from '../../repairWork/repairWorkShort';

import type { Probability } from '../../common/valueObjects'

export interface PredictedOperation {
    predictionId: number;
    repairWork: RepairWorkShort;

    probabilityScore: Probability;
    rankPosition: number;

    predictedTimeSpent: number;

    createdAt: string;
}
