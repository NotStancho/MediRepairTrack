// api/diagnosis/dss/complexityLevel.ts

import { api } from '../../api';
import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';
import type {
    CreateComplexityLevelPayload,
    UpdateComplexityLevelPayload,
} from '../../../types/diagnosis/DSS/complexityLevelPayloads';

export const createComplexityLevel = async (
    payload: CreateComplexityLevelPayload
): Promise<ComplexityLevel> => {
    const res = await api.post<ComplexityLevel>(`/api/complexity-levels`, payload);
    return res.data;
};

export const updateComplexityLevel = async (
    id: number,
    payload: UpdateComplexityLevelPayload
): Promise<ComplexityLevel> => {
    const res = await api.put<ComplexityLevel>(`/api/complexity-levels/${id}`, payload);
    return res.data;
};

export const getComplexityLevelById = async (
    id: number
): Promise<ComplexityLevel> => {
    const res = await api.get<ComplexityLevel>(`/api/complexity-levels/${id}`);
    return res.data;
};

export const getComplexityLevels = async (): Promise<ComplexityLevel[]> => {
    const res = await api.get<ComplexityLevel[]>(`/api/complexity-levels`);
    return res.data;
};

export const deleteComplexityLevel = async (id: number): Promise<void> => {
    await api.delete(`/api/complexity-levels/${id}`);
};
