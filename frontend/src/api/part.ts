import { api } from './api';
import type { Part } from '../types/part.ts';

/* =======================
   PART (catalog / stock)
   ======================= */

// отримати всі запчастини
export const getAllParts = async (): Promise<Part[]> =>
    (await api.get<Part[]>('/api/part')).data;

// отримати запчастину по id
export const getPartById = async (partId: number): Promise<Part> =>
    (await api.get<Part>(`/api/part/${partId}`)).data;

// створити запчастину
export const createPart = async (payload: {
    supplierName: string;
    partCode: string;
    partName: string;
    stockQuantity: number;
    price: number;
    unitName: string;
    unitType: 'PIECE' | 'FRACTIONAL';
    description?: string;
}): Promise<Part> =>
    (await api.post<Part>('/api/part', payload)).data;

// оновити запчастину
export const updatePart = async (
    partId: number,
    payload: {
        supplierName: string;
        partName: string;
        price: number;
        unitName: string;
        unitType: 'PIECE' | 'FRACTIONAL';
        description?: string;
    }
): Promise<Part> =>
    (await api.put<Part>(`/api/part/${partId}`, payload)).data;

// додати на склад
export const addPartStock = async (
    partId: number,
    payload: { quantity: number }
): Promise<Part> =>
    (await api.patch<Part>(`/api/part/${partId}/add-stock`, payload)).data;

// видалити запчастину
export const deletePart = async (partId: number): Promise<void> => {
    await api.delete(`/api/part/${partId}`);
};
