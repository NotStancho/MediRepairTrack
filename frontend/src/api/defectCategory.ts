// api/defectCategory.ts

import { api } from './api';

import type { DefectCategory } from '../types/defectCategory/defectCategory';
import type {
    CreateDefectCategoryPayload,
    UpdateDefectCategoryPayload,
} from '../types/defectCategory/defectCategoryPayloads';

export const getAllDefectCategories = async (): Promise<DefectCategory[]> => {
    const res = await api.get<DefectCategory[]>('/api/defect-categories');
    return res.data;
};

export const getDefectCategoryById = async (
    id: number
): Promise<DefectCategory> => {
    const res = await api.get<DefectCategory>(`/api/defect-categories/${id}`);
    return res.data;
};

export const createDefectCategory = async (
    payload: CreateDefectCategoryPayload
): Promise<DefectCategory> => {
    const res = await api.post<DefectCategory>('/api/defect-categories', payload);
    return res.data;
};

export const updateDefectCategory = async (
    id: number,
    payload: UpdateDefectCategoryPayload
): Promise<DefectCategory> => {
    const res = await api.put<DefectCategory>(`/api/defect-categories/${id}`, payload);
    return res.data;
};

export const deleteDefectCategory = async (id: number): Promise<void> => {
    await api.delete(`/api/defect-categories/${id}`);
};
