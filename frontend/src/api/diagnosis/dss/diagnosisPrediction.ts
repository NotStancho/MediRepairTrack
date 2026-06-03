// api/diagnosis/dss/diagnosisPrediction.ts

import { api } from '../../api';
import type { DiagnosisPrediction } from '../../../types/diagnosis/DSS/diagnosisPrediction';
import type {
    CreateManualPredictionPayload,
    UpdatePredictionPayload
} from '../../../types/diagnosis/DSS/diagnosisPredictionPayloads';

import { mapPrediction } from '../../../utils/mappers/dss/predictionMapper';

type RawPrediction = Parameters<typeof mapPrediction>[0];

export const getPredictionById = async (id: number): Promise<DiagnosisPrediction> => {
    const res = await api.get<RawPrediction>(`/api/predictions/${id}`);
    return mapPrediction(res.data);
};

export const getPredictionsByDiagnosis = async (
    diagnosisId: number
): Promise<DiagnosisPrediction[]> => {
    const res = await api.get<RawPrediction[]>(`/api/predictions/diagnosis/${diagnosisId}`);
    return res.data.map(mapPrediction);
};

export const createManualPrediction = async (
    payload: CreateManualPredictionPayload
): Promise<DiagnosisPrediction> => {
    const res = await api.post<RawPrediction>(`/api/predictions/manual`, payload);
    return mapPrediction(res.data);
};

export const updatePrediction = async (
    id: number,
    payload: UpdatePredictionPayload
): Promise<DiagnosisPrediction> => {
    const res = await api.put<RawPrediction>(`/api/predictions/${id}`, payload);
    return mapPrediction(res.data);
};

export const deletePrediction = async (id: number): Promise<void> => {
    await api.delete(`/api/predictions/${id}`);
};

export const recalculatePrediction = async (id: number): Promise<void> => {
    await api.post(`/api/predictions/${id}/recalculate`);
};

export const regeneratePredictionExplanation = async (
    id: number
): Promise<DiagnosisPrediction> => {
    const res = await api.post<RawPrediction>(`/api/predictions/${id}/regenerate-explanation`);
    return mapPrediction(res.data);
};
