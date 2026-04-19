// api/part.ts

import { api } from './api';
import type { Part } from '../types/part/part';
import type {
    AddPartStockPayload,
    CreatePartPayload,
    UpdatePartPayload,
} from '../types/part/partPayloads';

export const getAllParts = async (): Promise<Part[]> => {
    const res = await api.get<Part[]>('/api/part');
    return res.data;
};

export const getPartById = async (partId: number): Promise<Part> => {
    const res = await api.get<Part>(`/api/part/${partId}`);
    return res.data;
};

export const createPart = async (
    payload: CreatePartPayload
): Promise<Part> => {
    const res = await api.post<Part>('/api/part', payload);
    return res.data;
};

export const updatePart = async (
    partId: number,
    payload: UpdatePartPayload
): Promise<Part> => {
    const res = await api.put<Part>(`/api/part/${partId}`, payload);
    return res.data;
};

export const addPartStock = async (
    partId: number,
    payload: AddPartStockPayload
): Promise<Part> => {
    const res = await api.patch<Part>(`/api/part/${partId}/add-stock`, payload);
    return res.data;
};

export const deletePart = async (partId: number): Promise<void> => {
    await api.delete(`/api/part/${partId}`);
};
