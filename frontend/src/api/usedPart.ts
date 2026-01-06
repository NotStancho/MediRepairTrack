import { api } from './api';
import type { UsedPart } from '../types/usedPart';

/* =======================
   USED PART (claim scope)
   ======================= */

// отримати всі використані запчастини по заявці
export const getUsedPartsByClaim = async (
    claimId: number
): Promise<UsedPart[]> =>
    (await api.get<UsedPart[]>(`/api/part/claim/${claimId}/used`)).data;

// використати запчастину у заявці
export const usePartInClaim = async (
    claimId: number,
    employeeId: number,
    payload: {
        partId: number;
        quantity: number;
    }
): Promise<UsedPart> =>
    (await api.post<UsedPart>(
        `/api/part/claim/${claimId}/use`,
        payload,
        { params: { employeeId } }
    )).data;

// скоригувати кількість використаної запчастини
export const updateUsedPartQuantity = async (
    claimId: number,
    employeeId: number,
    payload: {
        partId: number;
        newQuantity: number;
    }
): Promise<UsedPart> =>
    (await api.patch<UsedPart>(
        `/api/part/claim/${claimId}/used`,
        payload,
        { params: { employeeId } }
    )).data;
