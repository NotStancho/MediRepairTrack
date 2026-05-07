// api/diagnosis/dss/predictedWorkPart.ts

import { api } from '../../api';
import type { PredictedWorkPart } from '../../../types/diagnosis/DSS/predictedWorkPart';
import type {
    CreatePredictedWorkPartPayload,
    UpdatePredictedWorkPartPayload
} from '../../../types/diagnosis/DSS/predictedWorkPartPayloads';
import type { PartShort } from '../../../types/part/partShort';

import { mapPredictedWorkPart } from '../../../utils/mappers/dss/predictedWorkPartMapper';

type Raw = Parameters<typeof mapPredictedWorkPart>[0];

export const createPredictedWorkPart = async (
    payload: CreatePredictedWorkPartPayload
): Promise<PredictedWorkPart> => {
    const res = await api.post<Raw>(`/api/dss/predicted-work-parts`, payload);
    return mapPredictedWorkPart(res.data);
};

export const createPredictedWorkPartsBatch = async (
    payload: CreatePredictedWorkPartPayload[]
): Promise<PredictedWorkPart[]> => {
    const res = await api.post<Raw[]>(`/api/dss/predicted-work-parts/batch`, payload);
    return res.data.map(mapPredictedWorkPart);
};

export const getPredictedWorkPartById = async (
    predictionId: number,
    repairWorkId: number,
    partId: number
): Promise<PredictedWorkPart> => {
    const res = await api.get<Raw>(
        `/api/dss/predicted-work-parts/prediction/${predictionId}/work/${repairWorkId}/part/${partId}`
    );
    return mapPredictedWorkPart(res.data);
};

export const updatePredictedWorkPart = async (
    predictionId: number,
    repairWorkId: number,
    partId: number,
    payload: UpdatePredictedWorkPartPayload
): Promise<PredictedWorkPart> => {
    const res = await api.put<Raw>(
        `/api/dss/predicted-work-parts/${predictionId}/${repairWorkId}/${partId}`,
        payload
    );
    return mapPredictedWorkPart(res.data);
};

export const deletePredictedWorkPart = async (
    predictionId: number,
    repairWorkId: number,
    partId: number
): Promise<void> => {
    await api.delete(`/api/dss/predicted-work-parts/${predictionId}/${repairWorkId}/${partId}`);
};

export const getPredictedWorkParts = async (
    predictionId: number
): Promise<PredictedWorkPart[]> => {
    const res = await api.get<Raw[]>(`/api/dss/predicted-work-parts/prediction/${predictionId}`);
    return res.data.map(mapPredictedWorkPart);
};

export const getPredictedWorkPartsByWork = async (
    predictionId: number,
    repairWorkId: number
): Promise<PredictedWorkPart[]> => {
    const res = await api.get<Raw[]>(
        `/api/dss/predicted-work-parts/prediction/${predictionId}/work/${repairWorkId}`
    );
    return res.data.map(mapPredictedWorkPart);
};

export const getAvailablePartsForPredictedWork = async (
    predictionId: number,
    repairWorkId: number
): Promise<PartShort[]> => {
    const res = await api.get<PartShort[]>(
        `/api/dss/predicted-work-parts/available/${predictionId}/${repairWorkId}`
    );
    return res.data;
};
