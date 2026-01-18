// api/client
import { api } from './api';
import type { ClientFull } from '../types/client/clientFull';
import type { ClientSearch } from '../types/client/ClientSearch';

export const getClientFullById = async (id: number) =>
    (await api.get<ClientFull>(`/api/client/${id}/full`)).data;

export const searchClientsPrefix = async (q: string, limit = 10) =>
    (await api.get<ClientSearch[]>('/api/client/search/prefix', {
        params: { q, limit }
    })).data;