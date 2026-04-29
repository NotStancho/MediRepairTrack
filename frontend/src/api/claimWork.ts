// api/claimWork

import { api } from './api';

import type { ClaimWork } from '../types/claim/claimWork';
import type {
    CreateClaimWorkPayload,
    UpdateClaimWorkNotePayload,
    UpdateClaimWorkPayload,
} from '../types/claim/claimWorkPayloads';

export const getClaimWorksByClaim = async (claimId: number) =>
    (await api.get<ClaimWork[]>(
        `/api/claim-works/claim/${claimId}`,
    )).data;

export const createClaimWork = async (
    payload: CreateClaimWorkPayload,
    performedByEmployeeId: number,
) =>
    (await api.post<ClaimWork>(
        '/api/claim-works',
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const updateClaimWork = async (
    id: number,
    payload: UpdateClaimWorkPayload,
    performedByEmployeeId: number,
) =>
    (await api.put<ClaimWork>(
        `/api/claim-works/${id}`,
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const updateClaimWorkNote = async (
    id: number,
    payload: UpdateClaimWorkNotePayload,
    performedByEmployeeId: number,
) =>
    (await api.patch<ClaimWork>(
        `/api/claim-works/${id}/note`,
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const deleteClaimWork = async (
    id: number,
    performedByEmployeeId: number,
) => {
    await api.delete(`/api/claim-works/${id}`, {
        params: { performedByEmployeeId },
    });
};
