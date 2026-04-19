// api/repairOperation.ts

import { api } from './api';

import type { RepairOperation } from '../types/repairOperation/repairOperation';
import type {
    CreateRepairOperationPayload,
    UpdateRepairOperationPayload,
} from '../types/repairOperation/repairOperationPayloads';

export const getAllRepairOperations = async (): Promise<RepairOperation[]> => {
    const res = await api.get<RepairOperation[]>('/api/repair-operations');
    return res.data;
};

export const getRepairOperationById = async (
    id: number
): Promise<RepairOperation> => {
    const res = await api.get<RepairOperation>(`/api/repair-operations/${id}`);
    return res.data;
};

export const createRepairOperation = async (
    payload: CreateRepairOperationPayload,
    employeeId: number
): Promise<RepairOperation> => {
    const res = await api.post<RepairOperation>(
        '/api/repair-operations',
        payload,
        { params: { employeeId } }
    );
    return res.data;
};

export const updateRepairOperation = async (
    id: number,
    payload: UpdateRepairOperationPayload
): Promise<RepairOperation> => {
    const res = await api.put<RepairOperation>(`/api/repair-operations/${id}`, payload);
    return res.data;
};

export const deleteRepairOperation = async (id: number): Promise<void> => {
    await api.delete(`/api/repair-operations/${id}`);
};
