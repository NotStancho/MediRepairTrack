// utils/diagnosisLabels.ts

import type { DiagnosisStatus, DiagnosisType } from '../types/diagnosis/diagnosis';

export const DIAGNOSIS_STATUS_LABELS: Record<DiagnosisStatus, string> = {
    DRAFT: 'Чернетка',
    PREDICTED: 'Спрогнозовано',
    CONFIRMED: 'Підтверджено',
    REJECTED: 'Відхилено',
    ARCHIVED: 'Архівовано',
};

export const DIAGNOSIS_STATUS_ACTION_LABELS: Partial<Record<DiagnosisStatus, string>> = {
    CONFIRMED: 'Підтвердити',
    REJECTED: 'Відхилити',
    ARCHIVED: 'Архівувати',
};


export const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
    AUTOMATED: 'Автоматична',
    MANUAL: 'Ручна',
    HYBRID: 'Гібридна',
};

export const DIAGNOSIS_STATUS_COLORS: Record<DiagnosisStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    PREDICTED: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    ARCHIVED: 'bg-slate-100 text-slate-700',
};

export const DIAGNOSIS_TYPE_COLORS: Record<DiagnosisType, string> = {
    AUTOMATED: 'bg-indigo-100 text-indigo-800',
    MANUAL: 'bg-emerald-100 text-emerald-800',
    HYBRID: 'bg-purple-100 text-purple-800',
};