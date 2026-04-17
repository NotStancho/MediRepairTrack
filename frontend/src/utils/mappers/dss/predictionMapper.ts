// utils/mappers/dss/predictionMapper.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { DiagnosisPrediction } from '../../../types/diagnosis/DSS/diagnosisPrediction';

type RawPrediction = Omit<
    DiagnosisPrediction,
    'predictedWarrantyProbability' | 'confidenceScore'
> & {
    predictedWarrantyProbability: number;
    confidenceScore: number;
};

export function mapPrediction(p: RawPrediction): DiagnosisPrediction {
    return {
        ...p,
        predictedWarrantyProbability: toProbability(p.predictedWarrantyProbability),
        confidenceScore: toProbability(p.confidenceScore),
    };
}

export const mapPredictions = (list: RawPrediction[]): DiagnosisPrediction[] =>
    list.map(mapPrediction);