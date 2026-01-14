// types/equipment/equipment
export interface Equipment {
    id: number;
    modelId: number;
    serialNumber: string;
    purchaseDate: string;
    price: number;
    description: string | null;
    createdAt?: string;
    updatedAt?: string | null;
}