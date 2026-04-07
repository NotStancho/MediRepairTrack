// utils/mappers/dss/predictedDefectMapper.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { PredictedDefectCategory } from '../../../types/diagnosis/DSS/predictedDefectCategory';

type RawPredictedDefect = Omit<
    PredictedDefectCategory,
    'probabilityScore'
> & {
    probabilityScore: number;
};

export function mapPredictedDefect(d: RawPredictedDefect): PredictedDefectCategory {
    return {
        ...d,
        probabilityScore: toProbability(d.probabilityScore),
    };
}