import { api } from './api';
import type { Claim } from '../types/claim/claim.ts';
import type {CreateClaimByClientPayload, CreateClaimByEmployeePayload} from "../types/claim/CreateClaimPayload";

export const getClaimsByClient = async (clientId: number) =>
    (await api.get<Claim[]>(`/api/claim/client/${clientId}`)).data;

export const getAllClaims = async () =>
    (await api.get<Claim[]>(`/api/claim`)).data;

export const getClaimById = async (id: number) =>
    (await api.get<Claim>(`/api/claim/${id}`)).data;

export const createClaimByClient = async (payload: CreateClaimByClientPayload) =>
    (await api.post<Claim>('/api/claim/client', payload)).data;

export const createClaimByEmployee = async (payload: CreateClaimByEmployeePayload) =>
    (await api.post<Claim>('/api/claim/employee', payload)).data;
