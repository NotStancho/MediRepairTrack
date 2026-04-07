// api/diagnosis/dss/predictedOperations.ts

import { api } from '../../api';
import type { PredictedOperation } from '../../../types/diagnosis/DSS/predictedOperation';
import type {
    CreatePredictedOperationPayload,
    UpdatePredictedOperationPayload
} from '../../../types/diagnosis/DSS/predictedOperationPayloads';
import type { RepairOperationShort } from '../../../types/repairOperation/repairOperationShort';

import { mapPredictedOperation } from '../../../utils/mappers/dss/predictedOperationMapper';

type Raw = Parameters<typeof mapPredictedOperation>[0];

export const createPredictedOperation = async (
    payload: CreatePredictedOperationPayload
): Promise<PredictedOperation> => {
    const res = await api.post<Raw>(`/api/dss/predicted-operations`, payload);
    return mapPredictedOperation(res.data);
};

export const createPredictedOperationsBatch = async (
    payload: CreatePredictedOperationPayload[]
): Promise<PredictedOperation[]> => {
    const res = await api.post<Raw[]>(`/api/dss/predicted-operations/batch`, payload);
    return res.data.map(mapPredictedOperation);
};

export const getPredictedOperationById = async (
    predictionId: number,
    operationId: number
): Promise<PredictedOperation> => {
    const res = await api.get<Raw>(
        `/api/dss/predicted-operations/prediction/${predictionId}/operation/${operationId}`
    );
    return mapPredictedOperation(res.data);
};

export const updatePredictedOperation = async (
    predictionId: number,
    operationId: number,
    payload: UpdatePredictedOperationPayload
): Promise<PredictedOperation> => {
    const res = await api.put<Raw>(
        `/api/dss/predicted-operations/${predictionId}/${operationId}`,
        payload
    );
    return mapPredictedOperation(res.data);
};

export const deletePredictedOperation = async (
    predictionId: number,
    operationId: number
): Promise<void> => {
    await api.delete(`/api/dss/predicted-operations/${predictionId}/${operationId}`);
};

export const getPredictedOperations = async (
    predictionId: number
): Promise<PredictedOperation[]> => {
    const res = await api.get<Raw[]>(`/api/dss/predicted-operations/prediction/${predictionId}`);
    return res.data.map(mapPredictedOperation);
};

export const getAvailableOperations = async (
    predictionId: number
): Promise<RepairOperationShort[]> => {
    const res = await api.get<RepairOperationShort[]>(
        `/api/dss/predicted-operations/available/${predictionId}`
    );
    return res.data;
};