// utils/mappers/dss/similarityMapper.ts

import { toProbability } from '../../../types/common/valueObjects';
import type { SimilarityResult } from '../../../types/diagnosis/DSS/similarityResult';

type RawSimilarityResult = Omit<
    SimilarityResult,
    'similarityScore'
> & {
    similarityScore: number;
};

export function mapSimilarityResult(r: RawSimilarityResult): SimilarityResult {
    return {
        ...r,
        similarityScore: toProbability(r.similarityScore),
    };
}