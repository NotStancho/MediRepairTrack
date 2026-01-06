export type DeliveryType =
    | 'CLIENT_DROP_OFF'
    | 'CLIENT_PICKUP'
    | 'COURIER_TO_SERVICE'
    | 'SERVICE_TO_CLIENT'
    | 'COURIER_INTER_CENTER'
    | 'ENGINEER_ON_SITE'
    | 'COURIER_RETURN_TO_CLIENT'
    | 'OTHER';

export type DeliveryProvider =
    | 'NOVA_POSHTA'
    | 'UKRPOSHTA'
    | 'MEEST'
    | 'SELF'
    | 'ENGINEER'
    | 'OTHER';

export type DeliveryStatus =
    | 'CREATED'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'FAILED'
    | 'CANCELED';

export interface Delivery {
    id: number;
    claimId: number;

    type: DeliveryType;
    provider: DeliveryProvider;
    status: DeliveryStatus;

    trackingCode?: string | null;

    distanceKm?: number | null;
    pricePerUnit?: number | null;
    price?: number | null;

    description?: string | null;
}
