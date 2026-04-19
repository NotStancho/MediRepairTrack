// api/equipmentModel

import { api } from './api';

import type { EquipmentModel } from '../types/equipmentModel/equipmentModel';
import type { EquipmentModelShort } from '../types/equipmentModel/equipmentModelShort';
import type { EquipmentType } from '../types/equipmentModel/equipmentType';
import type {
    CreateEquipmentModelPayload,
    UpdateEquipmentModelPayload,
} from '../types/equipmentModel/equipmentModelPayloads';

export const getAllEquipmentModels = async (): Promise<EquipmentModel[]> => {
    const res = await api.get<EquipmentModel[]>('/api/equipment-model');
    return res.data;
};

export const getAllEquipmentModelsShort = async (): Promise<EquipmentModelShort[]> => {
    const res = await api.get<EquipmentModelShort[]>('/api/equipment-model/short');
    return res.data;
};

export const getEquipmentModelById = async (id: number): Promise<EquipmentModel> => {
    const res = await api.get<EquipmentModel>(`/api/equipment-model/${id}`);
    return res.data;
};

export const searchEquipmentModelsByName = async (q: string): Promise<EquipmentModel[]> => {
    const res = await api.get<EquipmentModel[]>('/api/equipment-model/search/model-name', {
        params: { q },
    });
    return res.data;
};

export const searchEquipmentModelsByManufacturer = async (q: string): Promise<EquipmentModel[]> => {
    const res = await api.get<EquipmentModel[]>('/api/equipment-model/search/manufacturer', {
        params: { q },
    });
    return res.data;
};

export const getEquipmentModelsByType = async (type: EquipmentType): Promise<EquipmentModel[]> => {
    const res = await api.get<EquipmentModel[]>(`/api/equipment-model/type/${type}`);
    return res.data;
};

export const createEquipmentModel = async (
    payload: CreateEquipmentModelPayload
): Promise<EquipmentModel> => {
    const res = await api.post<EquipmentModel>('/api/equipment-model', payload);
    return res.data;
};

export const updateEquipmentModel = async (
    id: number,
    payload: UpdateEquipmentModelPayload
): Promise<EquipmentModel> => {
    const res = await api.put<EquipmentModel>(`/api/equipment-model/${id}`, payload);
    return res.data;
};

export const deleteEquipmentModel = async (id: number): Promise<void> => {
    await api.delete(`/api/equipment-model/${id}`);
};