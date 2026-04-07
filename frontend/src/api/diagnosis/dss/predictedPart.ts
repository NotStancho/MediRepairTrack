// api/diagnosis/dss/predictedPart.ts

import { api } from '../../api';
import type { PredictedPart } from '../../../types/diagnosis/DSS/predictedPart';
import type {
    CreatePredictedPartPayload,
    UpdatePredictedPartPayload
} from '../../../types/diagnosis/DSS/predictedPartPayloads';
import type { PartShort } from '../../../types/part/partShort';

import { mapPredictedPart } from '../../../utils/mappers/dss/predictedPartMapper';

type Raw = Parameters<typeof mapPredictedPart>[0];

export const createPredictedPart = async (
    payload: CreatePredictedPartPayload
): Promise<PredictedPart> => {
    const res = await api.post<Raw>(`/api/dss/predicted-parts`, payload);
    return mapPredictedPart(res.data);
};

export const createPredictedPartsBatch = async (
    payload: CreatePredictedPartPayload[]
): Promise<PredictedPart[]> => {
    const res = await api.post<Raw[]>(`/api/dss/predicted-parts/batch`, payload);
    return res.data.map(mapPredictedPart);
};

export const getPredictedPartById = async (
    predictionId: number,
    partId: number
): Promise<PredictedPart> => {
    const res = await api.get<Raw>(
        `/api/dss/predicted-parts/prediction/${predictionId}/part/${partId}`
    );
    return mapPredictedPart(res.data);
};

export const updatePredictedPart = async (
    predictionId: number,
    partId: number,
    payload: UpdatePredictedPartPayload
): Promise<PredictedPart> => {
    const res = await api.put<Raw>(
        `/api/dss/predicted-parts/${predictionId}/${partId}`,
        payload
    );
    return mapPredictedPart(res.data);
};

export const deletePredictedPart = async (
    predictionId: number,
    partId: number
): Promise<void> => {
    await api.delete(`/api/dss/predicted-parts/${predictionId}/${partId}`);
};

export const getPredictedParts = async (
    predictionId: number
): Promise<PredictedPart[]> => {
    const res = await api.get<Raw[]>(`/api/dss/predicted-parts/prediction/${predictionId}`);
    return res.data.map(mapPredictedPart);
};

export const getAvailableParts = async (
    predictionId: number
): Promise<PartShort[]> => {
    const res = await api.get<PartShort[]>(`/api/dss/predicted-parts/available/${predictionId}`);
    return res.data;
};
