// types/diagnosis/DSS/similarityResult.ts

export interface SimilarityResult {
    predictionId: number;
    claimId: number;

    similarityScore: number;
    rankPosition: number;

    createdAt: string;
}