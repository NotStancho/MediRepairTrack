// api/diagnosis/dss/predictedDefectCategory.ts

import { api } from '../../api';
import type { PredictedDefectCategory } from '../../../types/diagnosis/DSS/predictedDefectCategory';
import type {
    CreatePredictedDefectPayload,
    UpdatePredictedDefectPayload
} from '../../../types/diagnosis/DSS/predictedDefectCategoryPayload';
import type { DefectCategoryShort } from '../../../types/defectCategory/defectCategoryShort';

import { mapPredictedDefect } from '../../../utils/mappers/dss/predictedDefectMapper';

type Raw = Parameters<typeof mapPredictedDefect>[0];

export const createPredictedDefect = async (
    payload: CreatePredictedDefectPayload
): Promise<PredictedDefectCategory> => {
    const res = await api.post<Raw>(`/api/dss/predicted-defects`, payload);
    return mapPredictedDefect(res.data);
};

export const createPredictedDefectsBatch = async (
    payload: CreatePredictedDefectPayload[]
): Promise<PredictedDefectCategory[]> => {
    const res = await api.post<Raw[]>(`/api/dss/predicted-defects/batch`, payload);
    return res.data.map(mapPredictedDefect);
};

export const getPredictedDefectById = async (
    predictionId: number,
    defectId: number
): Promise<PredictedDefectCategory> => {
    const res = await api.get<Raw>(
        `/api/dss/predicted-defects/prediction/${predictionId}/defect/${defectId}`
    );
    return mapPredictedDefect(res.data);
};

export const updatePredictedDefect = async (
    predictionId: number,
    defectId: number,
    payload: UpdatePredictedDefectPayload
): Promise<PredictedDefectCategory> => {
    const res = await api.put<Raw>(
        `/api/dss/predicted-defects/${predictionId}/${defectId}`,
        payload
    );
    return mapPredictedDefect(res.data);
};

export const deletePredictedDefect = async (
    predictionId: number,
    defectId: number
): Promise<void> => {
    await api.delete(`/api/dss/predicted-defects/${predictionId}/${defectId}`);
};

export const getPredictedDefects = async (
    predictionId: number
): Promise<PredictedDefectCategory[]> => {
    const res = await api.get<Raw[]>(`/api/dss/predicted-defects/prediction/${predictionId}`);
    return res.data.map(mapPredictedDefect);
};

export const getAvailableDefects = async (
    predictionId: number
): Promise<DefectCategoryShort[]> => {
    const res = await api.get<DefectCategoryShort[]>(
        `/api/dss/predicted-defects/available/${predictionId}`
    );
    return res.data;
};