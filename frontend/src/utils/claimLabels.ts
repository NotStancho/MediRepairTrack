import type { ClaimStatus, RepairType } from '../types/claim/claim';

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
    NEW: 'Нова',
    IN_REVIEW: 'На розгляді',
    ACCEPTED: 'Прийнята',
    REJECTED: 'Відхилена',
    ASSIGNED_TO_ENGINEER: 'Призначено інженера',
    IN_PROGRESS: 'В роботі',
    WAITING_FOR_PARTS: 'Очікує запчастини',
    COMPLETED: 'Завершена',
    CANCELED: 'Скасована',
};

export const REPAIR_TYPE_LABELS: Record<RepairType, string> = {
    WAITING_DECISION: 'Очікує рішення',
    WARRANTY_REPAIR: 'Гарантійний ремонт',
    POST_WARRANTY_REPAIR: 'Післягарантійний ремонт',
    DIAGNOSTIC: 'Діагностика',
    PREVENTIVE_REPAIR: 'Профілактика',
    URGENT_REPAIR: 'Терміновий ремонт',
    INSTALLATION: 'Встановлення',
    CALIBRATION: 'Калібрування',
    MAINTENANCE: 'Обслуговування',
};

export const STATUS_COLORS: Record<ClaimStatus, string> = {
    NEW: 'bg-gray-100 text-gray-700',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    ASSIGNED_TO_ENGINEER: 'bg-indigo-100 text-indigo-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    WAITING_FOR_PARTS: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELED: 'bg-red-100 text-red-800',
};

export const REPAIR_TYPE_COLORS: Record<RepairType, string> = {
    WAITING_DECISION: 'bg-gray-100 text-gray-700',
    WARRANTY_REPAIR: 'bg-green-100 text-green-800',
    POST_WARRANTY_REPAIR: 'bg-blue-100 text-blue-800',
    DIAGNOSTIC: 'bg-indigo-100 text-indigo-800',
    PREVENTIVE_REPAIR: 'bg-teal-100 text-teal-800',
    URGENT_REPAIR: 'bg-red-100 text-red-800',
    INSTALLATION: 'bg-purple-100 text-purple-800',
    CALIBRATION: 'bg-yellow-100 text-yellow-800',
    MAINTENANCE: 'bg-slate-100 text-slate-700',
};
