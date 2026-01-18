// api/equipmentModel
import { api } from './api';
import type { EquipmentModel } from '../types/equipment/equipmentModel';

export const getEquipmentModels = async () =>
    (await api.get<EquipmentModel[]>('/api/equipment-model')).data;
