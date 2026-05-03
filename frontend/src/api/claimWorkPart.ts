// api/claimWorkPart

import { api } from './api';
import type { ClaimWorkPart } from '../types/claim/claimWorkPart';
import type {
    CreateClaimWorkPartPayload,
    UpdateClaimWorkPartQuantityPayload,
} from '../types/claim/claimWorkPartPayloads';

export const getClaimWorkParts = async (
    claimWorkId: number,
): Promise<ClaimWorkPart[]> =>
    (await api.get<ClaimWorkPart[]>(
        `/api/claim-works/${claimWorkId}/parts`,
    )).data;

export const getClaimPartsByClaim = async (
    claimId: number,
): Promise<ClaimWorkPart[]> =>
    (await api.get<ClaimWorkPart[]>(
        `/api/claims/${claimId}/parts`,
    )).data;

export const addClaimWorkPart = async (
    claimWorkId: number,
    employeeId: number,
    payload: CreateClaimWorkPartPayload,
): Promise<ClaimWorkPart> =>
    (await api.post<ClaimWorkPart>(
        `/api/claim-works/${claimWorkId}/parts`,
        payload,
        { params: { employeeId } },
    )).data;

export const updateClaimWorkPartQuantity = async (
    claimWorkId: number,
    employeeId: number,
    payload: UpdateClaimWorkPartQuantityPayload,
): Promise<ClaimWorkPart> =>
    (await api.put<ClaimWorkPart>(
        `/api/claim-works/${claimWorkId}/parts`,
        payload,
        { params: { employeeId } },
    )).data;

export const deleteClaimWorkPart = async (
    claimWorkId: number,
    partId: number,
    employeeId: number,
): Promise<void> => {
    await api.delete(`/api/claim-works/${claimWorkId}/parts/${partId}`, {
        params: { employeeId },
    });
};
