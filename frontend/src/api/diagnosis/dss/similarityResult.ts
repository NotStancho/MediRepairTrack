// api/diagnosis/dss/similarityResult.ts

import { api } from '../../api';
import type { SimilarityResult } from '../../../types/diagnosis/DSS/similarityResult';
import type {
    CreateSimilarityResultPayload,
    UpdateSimilarityResultPayload
} from '../../../types/diagnosis/DSS/similarityResultPayloads';
import type { ClaimShort } from '../../../types/claim/claimShort';

import { mapSimilarityResult } from '../../../utils/mappers/dss/similarityMapper';

type Raw = Parameters<typeof mapSimilarityResult>[0];

export const createSimilarityResult = async (
    payload: CreateSimilarityResultPayload
): Promise<SimilarityResult> => {
    const res = await api.post<Raw>(`/api/dss/similarity-results`, payload);
    return mapSimilarityResult(res.data);
};

export const createSimilarityResultsBatch = async (
    payload: CreateSimilarityResultPayload[]
): Promise<SimilarityResult[]> => {
    const res = await api.post<Raw[]>(`/api/dss/similarity-results/batch`, payload);
    return res.data.map(mapSimilarityResult);
};

export const updateSimilarityResult = async (
    predictionId: number,
    claimId: number,
    payload: UpdateSimilarityResultPayload
): Promise<SimilarityResult> => {
    const res = await api.put<Raw>(
        `/api/dss/similarity-results/${predictionId}/${claimId}`,
        payload
    );
    return mapSimilarityResult(res.data);
};

export const deleteSimilarityResult = async (
    predictionId: number,
    claimId: number
): Promise<void> => {
    await api.delete(`/api/dss/similarity-results/${predictionId}/${claimId}`);
};

export const getSimilarityResultById = async (
    predictionId: number,
    claimId: number
): Promise<SimilarityResult> => {
    const res = await api.get<Raw>(
        `/api/dss/similarity-results/prediction/${predictionId}/claim/${claimId}`
    );
    return mapSimilarityResult(res.data);
};

export const getSimilarityResults = async (
    predictionId: number
): Promise<SimilarityResult[]> => {
    const res = await api.get<Raw[]>(`/api/dss/similarity-results/prediction/${predictionId}`);
    return res.data.map(mapSimilarityResult);
};

export const getAvailableSimilarClaims = async (
    predictionId: number
): Promise<ClaimShort[]> => {
    const res = await api.get<ClaimShort[]>(
        `/api/dss/similarity-results/available/${predictionId}`
    );
    return res.data;
};