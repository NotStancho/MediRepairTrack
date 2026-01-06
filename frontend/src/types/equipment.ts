export type EquipmentType =
    | 'HEMOGLOBINOMETER'
    | 'MICROSCOPE'
    | 'ANALYZER'
    | 'CENTRIFUGE'
    | 'ELECTROCARDIOGRAPH'
    | 'ULTRASOUND'
    | 'XRAY';

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
