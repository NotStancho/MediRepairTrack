// types/claim/claimWorkPart

export interface ClaimWorkPart {
    claimWorkId: number;
    partId: number;
    partCode: string;
    partName: string;
    quantity: number;
    unitPrice: number;
    unitName: string;
    createdAt: string;
    updatedAt?: string | null;
}
