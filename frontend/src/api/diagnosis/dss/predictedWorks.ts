// api/diagnosis/dss/predictedWorks.ts

import { api } from '../../api';
import type { PredictedWork } from '../../../types/diagnosis/DSS/predictedWork';
import type {
    CreatePredictedWorkPayload,
    UpdatePredictedWorkPayload
} from '../../../types/diagnosis/DSS/predictedWorkPayloads';
import type { RepairWorkShort } from '../../../types/repairWork/repairWorkShort';

import { mapPredictedWork } from '../../../utils/mappers/dss/predictedWorkMapper';

type Raw = Parameters<typeof mapPredictedWork>[0];

export const createPredictedWork = async (
    payload: CreatePredictedWorkPayload
): Promise<PredictedWork> => {
    const res = await api.post<Raw>(`/api/dss/predicted-works`, payload);
    return mapPredictedWork(res.data);
};

export const createPredictedWorksBatch = async (
    payload: CreatePredictedWorkPayload[]
): Promise<PredictedWork[]> => {
    const res = await api.post<Raw[]>(`/api/dss/predicted-works/batch`, payload);
    return res.data.map(mapPredictedWork);
};

export const getPredictedWorkById = async (
    predictionId: number,
    repairWorkId: number
): Promise<PredictedWork> => {
    const res = await api.get<Raw>(
        `/api/dss/predicted-works/prediction/${predictionId}/repair-work/${repairWorkId}`
    );
    return mapPredictedWork(res.data);
};

export const updatePredictedWork = async (
    predictionId: number,
    repairWorkId: number,
    payload: UpdatePredictedWorkPayload
): Promise<PredictedWork> => {
    const res = await api.put<Raw>(
        `/api/dss/predicted-works/${predictionId}/${repairWorkId}`,
        payload
    );
    return mapPredictedWork(res.data);
};

export const deletePredictedWork = async (
    predictionId: number,
    repairWorkId: number
): Promise<void> => {
    await api.delete(`/api/dss/predicted-works/${predictionId}/${repairWorkId}`);
};

export const getPredictedWorks = async (
    predictionId: number
): Promise<PredictedWork[]> => {
    const res = await api.get<Raw[]>(`/api/dss/predicted-works/prediction/${predictionId}`);
    return res.data.map(mapPredictedWork);
};

export const getAvailableWorks = async (
    predictionId: number
): Promise<RepairWorkShort[]> => {
    const res = await api.get<RepairWorkShort[]>(
        `/api/dss/predicted-works/available/${predictionId}`
    );
    return res.data;
};
