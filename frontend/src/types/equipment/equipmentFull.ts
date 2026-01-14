// types/equipment/equipmentFull
import type { EquipmentType } from './equipmentType';

export interface EquipmentFull {
    id: number;
    serialNumber: string;
    purchaseDate: string;
    price: number;
    description: string | null;

    modelName: string;
    manufacturer: string;
    equipmentType: EquipmentType;
    releaseDate: string;
    descriptionModel: string | null;
}