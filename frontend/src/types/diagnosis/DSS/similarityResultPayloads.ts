// types/diagnosis/DSS/similarityResultPayloads.ts

export interface CreateSimilarityResultPayload {
    predictionId: number;
    similarClaimId: number;
    similarityScore: number;
}

export interface UpdateSimilarityResultPayload {
    similarityScore?: number;
}