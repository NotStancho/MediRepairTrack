// utils/mappers/dss/predictedOperations.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { PredictedOperation } from '../../../types/diagnosis/DSS/predictedOperation';

type RawPredictedOperation = Omit<
    PredictedOperation,
    'probabilityScore'
> & {
    probabilityScore: number;
};

export function mapPredictedOperation(op: RawPredictedOperation): PredictedOperation {
    return {
        ...op,
        probabilityScore: toProbability(op.probabilityScore),
    };
}