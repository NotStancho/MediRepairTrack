// utils/mappers/dss/predictedWorks.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { PredictedWork } from '../../../types/diagnosis/DSS/predictedWork';

type RawPredictedWork = Omit<
    PredictedWork,
    'probabilityScore'
> & {
    probabilityScore: number;
};

export function mapPredictedWork(raw: RawPredictedWork): PredictedWork {
    return {
        ...raw,
        probabilityScore: toProbability(raw.probabilityScore),
    };
}
