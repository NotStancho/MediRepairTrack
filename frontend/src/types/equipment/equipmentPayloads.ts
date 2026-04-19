// types/equipment/equipmentPayloads

export interface CreateEquipmentPayload {
    modelId: number;
    serialNumber: string;
    purchaseDate: string;
    price: number;
    description?: string | null;
}

export interface UpdateEquipmentPayload {
    modelId: number;
    serialNumber: string;
    purchaseDate: string;
    price: number;
    description?: string | null;
}