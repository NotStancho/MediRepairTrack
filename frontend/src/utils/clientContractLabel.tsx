// utils/clientContractLabel.ts

import type { ContractStatus } from '../types/clientContract/contractStatus';
import type { ContractType } from '../types/clientContract/contractType';

export const CONTRACT_TYPE_OPTIONS: ContractType[] = [
    'BASIC',
    'SILVER',
    'GOLD',
    'PLATINUM',
    'CUSTOM',
];

export const CONTRACT_STATUS_OPTIONS: ContractStatus[] = [
    'ACTIVE',
    'INACTIVE',
];

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
    BASIC: 'Базовий',
    SILVER: 'Срібний',
    GOLD: 'Золотий',
    PLATINUM: 'Платиновий',
    CUSTOM: 'Індивідуальний',
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
    ACTIVE: 'Активний',
    INACTIVE: 'Неактивний',
};

export const CONTRACT_TYPE_COLORS: Record<ContractType, string> = {
    BASIC: 'bg-slate-100 text-slate-800',
    SILVER: 'bg-zinc-100 text-zinc-800',
    GOLD: 'bg-amber-100 text-amber-800',
    PLATINUM: 'bg-cyan-100 text-cyan-800',
    CUSTOM: 'bg-brand-soft text-brand-strong',
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    INACTIVE: 'bg-rose-100 text-rose-800',
};

export function getContractTypeLabel(type?: ContractType | null) {
    if (!type) return '-';
    return CONTRACT_TYPE_LABELS[type] ?? type;
}

export function getContractStatusLabel(status?: ContractStatus | null) {
    if (!status) return '-';
    return CONTRACT_STATUS_LABELS[status] ?? status;
}
