// types/equipment/equipment

import type { EquipmentModelShort } from '../equipmentModel/equipmentModelShort';

export interface Equipment {
    id: number;

    model: EquipmentModelShort;

    serialNumber: string;
    purchaseDate: string;
    price: number;
    description: string | null;
    createdAt: string;
    updatedAt?: string | null;
}