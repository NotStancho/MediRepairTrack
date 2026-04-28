// api/claimRepairOperation

import { api } from './api';

import type { ClaimRepairOperation } from '../types/claim/claimRepairOperation';
import type {
    CreateClaimRepairOperationPayload,
    UpdateClaimRepairOperationNotePayload,
    UpdateClaimRepairOperationPayload,
} from '../types/claim/claimRepairOperationPayloads';

export const getClaimRepairOperationsByClaim = async (claimId: number) =>
    (await api.get<ClaimRepairOperation[]>(
        `/api/claim-repair-operations/claim/${claimId}`,
    )).data;

export const createClaimRepairOperation = async (
    payload: CreateClaimRepairOperationPayload,
    performedByEmployeeId: number,
) =>
    (await api.post<ClaimRepairOperation>(
        '/api/claim-repair-operations',
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const updateClaimRepairOperation = async (
    id: number,
    payload: UpdateClaimRepairOperationPayload,
    performedByEmployeeId: number,
) =>
    (await api.put<ClaimRepairOperation>(
        `/api/claim-repair-operations/${id}`,
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const updateClaimRepairOperationNote = async (
    id: number,
    payload: UpdateClaimRepairOperationNotePayload,
    performedByEmployeeId: number,
) =>
    (await api.patch<ClaimRepairOperation>(
        `/api/claim-repair-operations/${id}/note`,
        payload,
        { params: { performedByEmployeeId } },
    )).data;

export const deleteClaimRepairOperation = async (
    id: number,
    performedByEmployeeId: number,
) => {
    await api.delete(`/api/claim-repair-operations/${id}`, {
        params: { performedByEmployeeId },
    });
};
