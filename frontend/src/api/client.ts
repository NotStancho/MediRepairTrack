import { api } from './api';
import type { ClientFull } from '../types/client';

export const getClientFullById = async (id: number) =>
    (await api.get<ClientFull>(`/api/client/${id}/full`)).data;
