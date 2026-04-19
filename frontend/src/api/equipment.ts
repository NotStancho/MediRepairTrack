// api/equipment
import { api } from './api';
import type { Equipment } from '../types/equipment/equipment';
import type { EquipmentFull } from '../types/equipment/equipmentFull';
import type {
    CreateEquipmentPayload,
    UpdateEquipmentPayload
} from '../types/equipment/equipmentPayloads';

export const getAllEquipment = async (): Promise<Equipment[]> => {
    const res = await api.get<Equipment[]>('/api/equipment');
    return res.data;
};

export const getEquipmentById = async (id: number): Promise<Equipment> => {
    const res = await api.get<Equipment>(`/api/equipment/${id}`);
    return res.data;
};

export const getEquipmentFullById = async (id: number): Promise<EquipmentFull> => {
    const res = await api.get<EquipmentFull>(`/api/equipment/${id}/full`);
    return res.data;
};

export const getEquipmentByModel = async (modelId: number): Promise<Equipment[]> => {
    const res = await api.get<Equipment[]>(`/api/equipment/model/${modelId}`);
    return res.data;
};

export const findEquipmentByModelAndSerial = async (
    modelId: number,
    serialNumber: string
): Promise<Equipment> => {
    const res = await api.get<Equipment>('/api/equipment/find', {
        params: { modelId, serialNumber },
    });
    return res.data;
};

export const createEquipment = async (
    payload: CreateEquipmentPayload
): Promise<Equipment> => {
    const res = await api.post<Equipment>('/api/equipment', payload);
    return res.data;
};

export const updateEquipment = async (
    id: number,
    payload: UpdateEquipmentPayload
): Promise<Equipment> => {
    const res = await api.put<Equipment>(`/api/equipment/${id}`, payload);
    return res.data;
};

export const deleteEquipment = async (id: number): Promise<void> => {
    await api.delete(`/api/equipment/${id}`);
};