// types/diagnosis/DSS/predictedWork.ts
import type { RepairWorkShort } from '../../repairWork/repairWorkShort';

import type { Probability } from '../../common/valueObjects'

export interface PredictedWork {
    predictionId: number;
    repairWork: RepairWorkShort;

    probabilityScore: Probability;
    rankPosition: number;

    predictedTimeSpent: number;

    createdAt: string;
}
