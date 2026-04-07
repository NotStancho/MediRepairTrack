// utils/mappers/dss/predictedPartMapper.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { PredictedPart } from '../../../types/diagnosis/DSS/predictedPart';

type RawPredictedPart = Omit<
    PredictedPart,
    'probabilityScore'
> & {
    probabilityScore: number;
};

export function mapPredictedPart(p: RawPredictedPart): PredictedPart {
    return {
        ...p,
        probabilityScore: toProbability(p.probabilityScore),
    };
}