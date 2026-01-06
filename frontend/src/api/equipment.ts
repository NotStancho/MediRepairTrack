import { api } from './api';
import type { EquipmentFull } from '../types/equipment';

export const getEquipmentFullById = async (id: number) =>
    (await api.get<EquipmentFull>(`/api/equipment/${id}/full`)).data;
