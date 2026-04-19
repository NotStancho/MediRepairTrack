// types/equipment/equipmentFull
import type { EquipmentType } from '../equipmentModel/equipmentType.ts';

export interface EquipmentFull {
    id: number;
    serialNumber: string;
    purchaseDate: string;
    price: number;
    description: string | null;
    createdAt: string;
    updatedAt?: string | null;

    modelName: string;
    manufacturer: string;
    equipmentType: EquipmentType;
    releaseDate: string;
    descriptionModel: string | null;
}