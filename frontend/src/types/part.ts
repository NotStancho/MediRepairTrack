export interface Part {
    id: number;
    supplierName: string;
    partCode: string;
    partName: string;
    stockQuantity: number;
    price: number;
    unitName: string;
    unitType: 'PIECE' | 'FRACTIONAL';
    description?: string;
}
