// types/diagnosis/DSS/similarityResult.ts

import type { Probability } from '../../common/valueObjects'

export interface SimilarityResult {
    predictionId: number;
    claimId: number;

    similarityScore: Probability;
    rankPosition: number;

    createdAt: string;
}