// api/diagnosis.ts

import { api } from '../api';
import type { Diagnosis } from '../../types/diagnosis/diagnosis';
import type {
    CreateAutoDiagnosisPayload,
    CreateManualDiagnosisPayload,
    UpdateDiagnosisPayload
} from '../../types/diagnosis/diagnosisPayloads';

export const createAutoDiagnosis = async (payload: CreateAutoDiagnosisPayload): Promise<Diagnosis> => {
    const res = await api.post<Diagnosis>(`/api/diagnosis/auto`, payload);
    return res.data;
};

export const createManualDiagnosis = async (
    payload: CreateManualDiagnosisPayload
): Promise<Diagnosis> => {
    const res = await api.post<Diagnosis>(`/api/diagnosis/manual`, payload);
    return res.data;
};

export const updateDiagnosis = async (
    id: number,
    payload: UpdateDiagnosisPayload
): Promise<Diagnosis> => {
    const res = await api.put<Diagnosis>(`/api/diagnosis/${id}`, payload);
    return res.data;
};

export const confirmDiagnosis = async (
    id: number,
    engineerId: number
): Promise<Diagnosis> => {
    const res = await api.post<Diagnosis>(
        `/api/diagnosis/${id}/confirm`,
        null,
        { params: { engineerId } }
    );
    return res.data;
};

export const rejectDiagnosis = async (id: number): Promise<Diagnosis> => {
    const res = await api.post<Diagnosis>(`/api/diagnosis/${id}/reject`);
    return res.data;
};

export const archiveDiagnosis = async (id: number): Promise<Diagnosis> => {
    const res = await api.post<Diagnosis>(`/api/diagnosis/${id}/archive`);
    return res.data;
};

export const getDiagnosisById = async (id: number): Promise<Diagnosis> => {
    const res = await api.get<Diagnosis>(`/api/diagnosis/${id}`);
    return res.data;
};

export const getDiagnosesByClaim = async (claimId: number): Promise<Diagnosis[]> => {
    const res = await api.get<Diagnosis[]>(`/api/diagnosis/claim/${claimId}`);
    return res.data;
};