// api/clientContract.ts

import { api } from './api';

import type { ClientContract } from '../types/clientContract/clientContract';
import type {
    CreateClientContractPayload,
    UpdateClientContractPayload,
} from '../types/clientContract/clientContractPayloads';

export const getAllClientContracts = async (): Promise<ClientContract[]> => {
    const res = await api.get<ClientContract[]>('/api/contracts');
    return res.data;
};

export const getClientContractsByClientId = async (
    clientId: number
): Promise<ClientContract[]> => {
    const res = await api.get<ClientContract[]>(
        // TODO: replace with /api/contracts/my (security)
        `/api/contracts/client/${clientId}`
    );
    return res.data;
};

export const getClientContractById = async (
    id: number
): Promise<ClientContract> => {
    const res = await api.get<ClientContract>(`/api/contracts/${id}`);
    return res.data;
};

export const createClientContract = async (
    payload: CreateClientContractPayload
): Promise<ClientContract> => {
    const res = await api.post<ClientContract>('/api/contracts', payload);
    return res.data;
};

export const updateClientContract = async (
    id: number,
    payload: UpdateClientContractPayload
): Promise<ClientContract> => {
    const res = await api.put<ClientContract>(`/api/contracts/${id}`, {
        contractName: payload.contractName,
        contractType: payload.contractType,
        isActive: payload.status,
        validFrom: payload.validFrom,
        validTo: payload.validTo,
        discountLabor: payload.discountLabor,
        discountParts: payload.discountParts,
        discountDelivery: payload.discountDelivery,
        notes: payload.notes ?? null,
    });
    return res.data;
};

export const deleteClientContract = async (id: number): Promise<void> => {
    await api.delete(`/api/contracts/${id}`);
};
