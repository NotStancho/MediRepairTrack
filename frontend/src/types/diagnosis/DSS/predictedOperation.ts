// types/diagnosis/DSS/predictedOperation.ts
import type { RepairOperationShort } from '../../repairOperation/repairOperationShort';

import type { Probability } from '../../common/valueObjects'

export interface PredictedOperation {
    predictionId: number;
    operation: RepairOperationShort;

    probabilityScore: Probability;
    rankPosition: number;

    predictedTimeSpent: number;

    createdAt: string;
}