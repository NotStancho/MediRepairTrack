// types/diagnosis/DSS/similarityResult.ts

import type { Probability } from '../../common/valueObjects'
import type { ClaimShort } from '../../claim/claimShort';

export interface SimilarityResult {
    predictionId: number;
    claim: ClaimShort

    similarityScore: Probability;
    rankPosition: number;

    createdAt: string;
}