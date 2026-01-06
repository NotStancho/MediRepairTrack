import { api } from './api';
import type { Claim } from '../types/claim';

export const getClaimsByClient = async (clientId: number) =>
    (await api.get<Claim[]>(`/api/claim/client/${clientId}`)).data;

export const getAllClaims = async () =>
    (await api.get<Claim[]>(`/api/claim`)).data;

export const getClaimById = async (id: number) =>
    (await api.get<Claim>(`/api/claim/${id}`)).data;
