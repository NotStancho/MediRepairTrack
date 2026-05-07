// types/claim/claimWorkPartPayloads

export interface CreateClaimWorkPartPayload {
    partId: number;
    quantity: number;
}

export interface UpdateClaimWorkPartQuantityPayload {
    partId: number;
    newQuantity: number;
}
