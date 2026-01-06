import type { RoleInClaim } from '../types/assignedClaim';

/* =========================
   ROLE IN CLAIM LABELS
   ========================= */

export const ROLE_IN_CLAIM_LABELS: Record<RoleInClaim, string> = {
    LEAD: 'Головний інженер',
    ASSISTANT: 'Асистент',
    DIAGNOSTIC: 'Діагностика',
    INSTALLER: 'Монтаж',
    EXPERT: 'Експерт',
};

/* =========================
   ROLE IN CLAIM COLORS
   ========================= */

export const ROLE_IN_CLAIM_COLORS: Record<RoleInClaim, string> = {
    LEAD: 'bg-purple-100 text-purple-800',
    ASSISTANT: 'bg-gray-100 text-gray-800',
    DIAGNOSTIC: 'bg-blue-100 text-blue-800',
    INSTALLER: 'bg-indigo-100 text-indigo-800',
    EXPERT: 'bg-emerald-100 text-emerald-800',
};
