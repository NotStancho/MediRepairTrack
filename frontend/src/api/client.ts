// api/client.ts

import { api } from './api';
import type { Client } from '../types/client/client';
import type { ClientFull } from '../types/client/clientFull';
import type { ClientSearch } from '../types/client/ClientSearch';
import type {
    CreateClientPayload,
    UpdateClientPayload,
} from '../types/client/clientPayloads';

export const getAllClients = async (): Promise<Client[]> => {
    const res = await api.get<Client[]>('/api/client');
    return res.data;
};

export const getClientById = async (id: number): Promise<Client> => {
    const res = await api.get<Client>(`/api/client/${id}`);
    return res.data;
};

export const getClientFullById = async (id: number): Promise<ClientFull> => {
    const res = await api.get<ClientFull>(`/api/client/${id}/full`);
    return res.data;
};

export const createClient = async (
    payload: CreateClientPayload
): Promise<Client> => {
    const res = await api.post<Client>('/api/client', payload);
    return res.data;
};

export const updateClient = async (
    id: number,
    payload: UpdateClientPayload
): Promise<Client> => {
    const res = await api.put<Client>(`/api/client/${id}`, payload);
    return res.data;
};

export const deleteClient = async (id: number): Promise<void> => {
    await api.delete(`/api/client/${id}`);
};

export const searchClientsPrefix = async (q: string, limit = 10) =>
    (await api.get<ClientSearch[]>('/api/client/search/prefix', {
        params: { q, limit }
    })).data;
