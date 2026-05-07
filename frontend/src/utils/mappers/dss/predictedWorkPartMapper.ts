// utils/mappers/dss/predictedWorkPartMapper.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { PredictedWorkPart } from '../../../types/diagnosis/DSS/predictedWorkPart';

type RawPredictedPart = Omit<
    PredictedWorkPart,
    'probabilityScore' | 'predictedQuantity'
> & {
    probabilityScore: number;
    predictedQuantity: number | string;
};

export function mapPredictedWorkPart(p: RawPredictedPart): PredictedWorkPart {
    return {
        ...p,
        predictedQuantity: Number(p.predictedQuantity),
        probabilityScore: toProbability(p.probabilityScore),
    };
}
