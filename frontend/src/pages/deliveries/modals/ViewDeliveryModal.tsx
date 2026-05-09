// pages/deliveries/modals/ViewDeliveryModal

import type { ReactNode } from 'react';

import type { DeliveryView } from '../../../types/delivery';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import {
    DELIVERY_PROVIDER_LABELS,
} from '../../../utils/deliveryLabels';
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import DeliveryStatusBadge from '../../../components/badges/DeliveryStatusBadge';
import DeliveryTypeBadge from '../../../components/badges/DeliveryTypeBadge';

interface Props {
    delivery: DeliveryView;
    onClose: () => void;
}

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

function getDeliveryTotal(delivery: DeliveryView) {
    if (delivery.price != null) {
        return delivery.price;
    }

    if (delivery.distanceKm != null && delivery.pricePerUnit != null) {
        return delivery.distanceKm * delivery.pricePerUnit;
    }

    return null;
}

function formatKm(value?: number | null) {
    if (value == null) {
        return 'Не вказано';
    }

    return `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} км`;
}

export default function ViewDeliveryModal({ delivery, onClose }: Props) {
    const total = getDeliveryTotal(delivery);
    const isEngineerTrip = delivery.type === 'ENGINEER_ON_SITE';

    return (
        <Modal
            title={`Доставка #${delivery.id}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Доставка
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-ink-muted">
                                <div>Заявка #{delivery.claimId}</div>
                                <div>Клієнт: {delivery.clientOrganizationName}</div>
                                <div>Провайдер: {DELIVERY_PROVIDER_LABELS[delivery.provider]}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <DeliveryTypeBadge type={delivery.type} size="md" />
                            <DeliveryStatusBadge status={delivery.status} size="md" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Вартість"
                        value={total != null ? formatMoney(total) : 'Не розраховано'}
                        mono
                    />
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(delivery.createdAt)}
                    />
                </div>

                {isEngineerTrip ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InfoCard
                            label="Відстань"
                            value={formatKm(delivery.distanceKm)}
                        />
                        <InfoCard
                            label="Тариф за км"
                            value={
                                delivery.pricePerUnit != null
                                    ? `${formatMoney(delivery.pricePerUnit)} / км`
                                    : 'Не вказано'
                            }
                            mono
                        />
                        <InfoCard
                            label="Оновлено"
                            value={
                                delivery.updatedAt
                                    ? formatDateTime(delivery.updatedAt)
                                    : 'Ще не оновлювалось'
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InfoCard
                            label="Провайдер"
                            value={DELIVERY_PROVIDER_LABELS[delivery.provider]}
                        />
                        <InfoCard
                            label="Трек-код"
                            value={delivery.trackingCode?.trim() || 'Не вказано'}
                            mono
                        />
                        <InfoCard
                            label="Виконано"
                            value={
                                delivery.performedAt
                                    ? formatDateTime(delivery.performedAt)
                                    : 'Ще не виконано'
                            }
                        />
                    </div>
                )}

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>
                    <div className="mt-2 text-sm text-ink">
                        {delivery.description?.trim() || (
                            <span className="text-ink-muted">Опис не вказано</span>
                        )}
                    </div>
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
