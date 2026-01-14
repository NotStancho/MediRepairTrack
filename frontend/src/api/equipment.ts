// api/equipment
import { api } from './api';
import type { Equipment } from '../types/equipment/equipment';
import type { EquipmentFull } from '../types/equipment/equipmentFull';

export const findEquipmentByModelAndSerial = async (modelId: number, serialNumber: string) =>
    (await api.get<Equipment>('/api/equipment/find', {
        params: { modelId, serialNumber }
    })).data;

export const getEquipmentFullById = async (id: number) =>
    (await api.get<EquipmentFull>(`/api/equipment/${id}/full`)).data;
