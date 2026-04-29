// api/repairWork.ts

import { api } from './api';

import type { RepairWork } from '../types/repairWork/repairWork';
import type {
    CreateRepairWorkPayload,
    UpdateRepairWorkPayload,
} from '../types/repairWork/repairWorkPayloads';

export const getAllRepairWorks = async (): Promise<RepairWork[]> => {
    const res = await api.get<RepairWork[]>('/api/repair-works');
    return res.data;
};

export const getRepairWorkById = async (
    id: number
): Promise<RepairWork> => {
    const res = await api.get<RepairWork>(`/api/repair-works/${id}`);
    return res.data;
};

export const createRepairWork = async (
    payload: CreateRepairWorkPayload,
    employeeId: number
): Promise<RepairWork> => {
    const res = await api.post<RepairWork>(
        '/api/repair-works',
        payload,
        { params: { employeeId } }
    );
    return res.data;
};

export const updateRepairWork = async (
    id: number,
    payload: UpdateRepairWorkPayload
): Promise<RepairWork> => {
    const res = await api.put<RepairWork>(`/api/repair-works/${id}`, payload);
    return res.data;
};

export const deleteRepairWork = async (id: number): Promise<void> => {
    await api.delete(`/api/repair-works/${id}`);
};
