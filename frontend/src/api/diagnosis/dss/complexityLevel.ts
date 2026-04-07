// api/diagnosis/dss/complexityLevel.ts

import { api } from '../../api';
import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';
import type { CreateComplexityLevelPayload } from '../../../types/diagnosis/DSS/complexityLevelPayloads';

export const createComplexityLevel = async (
    payload: CreateComplexityLevelPayload
): Promise<ComplexityLevel> => {
    const res = await api.post<ComplexityLevel>(`/api/complexity-levels`, payload);
    return res.data;
};

export const getComplexityLevels = async (): Promise<ComplexityLevel[]> => {
    const res = await api.get<ComplexityLevel[]>(`/api/complexity-levels`);
    return res.data;
};