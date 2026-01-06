import type { DeliveryType, DeliveryProvider, DeliveryStatus } from '../types/delivery';

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
    CLIENT_DROP_OFF: 'Клієнт привіз',
    CLIENT_PICKUP: 'Клієнт забрав',
    COURIER_TO_SERVICE: 'Курʼєр → сервіс',
    SERVICE_TO_CLIENT: 'Сервіс → клієнт',
    COURIER_INTER_CENTER: 'Між сервісами',
    ENGINEER_ON_SITE: 'Виїзд інженера',
    COURIER_RETURN_TO_CLIENT: 'Повернення клієнту',
    OTHER: 'Інше',
};

export const DELIVERY_PROVIDER_LABELS: Record<DeliveryProvider, string> = {
    NOVA_POSHTA: 'Нова Пошта',
    UKRPOSHTA: 'Укрпошта',
    MEEST: 'Meest',
    SELF: 'Самовивіз',
    ENGINEER: 'Інженер',
    OTHER: 'Інше',
};

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
    CREATED: 'Створена',
    IN_TRANSIT: 'В дорозі',
    DELIVERED: 'Доставлено',
    FAILED: 'Помилка',
    CANCELED: 'Скасована',
};