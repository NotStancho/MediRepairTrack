// utils/deliveryLables.ts

import type { DeliveryType, DeliveryProvider, DeliveryStatus } from '../types/delivery';

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
    CLIENT_DROP_OFF: 'Клієнт привіз',
    CLIENT_PICKUP: 'Клієнт забрав',
    COURIER_TO_SERVICE: 'Курʼєр до сервісного центру',
    SERVICE_TO_CLIENT: 'Доставка клієнту',
    COURIER_INTER_CENTER: 'Між сервісними центрами',
    ENGINEER_ON_SITE: 'Виїзд інженера',
    COURIER_RETURN_TO_CLIENT: 'Повернення клієнту',
    OTHER: 'Інше',
};

export const DELIVERY_PROVIDER_LABELS: Record<DeliveryProvider, string> = {
    NOVA_POSHTA: 'Нова Пошта',
    UKRPOSHTA: 'Укрпошта',
    MEEST: 'Meest',
    SELF: 'Самовивіз',
    ENGINEER: 'Сервісний інженер',
    OTHER: 'Інше',
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
    CREATED: 'Створена',
    IN_TRANSIT: 'В дорозі',
    DELIVERED: 'Доставлено',
    FAILED: 'Помилка',
    CANCELED: 'Скасована',
};

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
    CREATED: 'bg-slate-100 text-slate-700',
    IN_TRANSIT: 'bg-amber-100 text-amber-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELED: 'bg-zinc-200 text-zinc-700',
};

export const DELIVERY_TYPE_COLORS: Record<DeliveryType, string> = {
    CLIENT_DROP_OFF: 'bg-sky-100 text-sky-800',
    CLIENT_PICKUP: 'bg-cyan-100 text-cyan-800',
    COURIER_TO_SERVICE: 'bg-orange-100 text-orange-800',
    SERVICE_TO_CLIENT: 'bg-indigo-100 text-indigo-800',
    COURIER_INTER_CENTER: 'bg-violet-100 text-violet-800',
    ENGINEER_ON_SITE: 'bg-emerald-100 text-emerald-800',
    COURIER_RETURN_TO_CLIENT: 'bg-blue-100 text-blue-800',
    OTHER: 'bg-slate-200 text-slate-700',
};
