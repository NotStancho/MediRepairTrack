// pages/client/ClientDeliveriesPage.tsx

import { useCallback, useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useDeliveries } from '../../hooks/useDeliveries';

import type { DeliveryView } from '../../types/delivery';

import DeliveriesTable from '../deliveries/DeliveriesTable';
import ViewDeliveryModal from '../deliveries/modals/ViewDeliveryModal';

export default function ClientDeliveriesPage() {
    const { user } = useAuth();
    const {
        data,
        loading,
        loadOne,
    } = useDeliveries({
        scope: 'client',
        clientId: user?.clientId ?? null,
    });

    const [viewItem, setViewItem] = useState<DeliveryView | null>(null);

    const handleView = useCallback((delivery: DeliveryView) => {
        void loadOne(delivery.id).then(item => {
            if (item) {
                setViewItem(item);
            }
        });
    }, [loadOne]);

    if (!user?.clientId) {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Доставки</h1>
                    <p className="text-sm text-ink-muted">
                        Перегляд ваших доставок: поштових відправлень, самовивозу та виїздів сервісних інженерів.
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-muted">
                    Для цього акаунта не прив&apos;язано клієнта.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <DeliveriesTable
                data={data}
                loading={loading}
                onView={handleView}
                storageKey="client-deliveries-table"
                globalFilterPlaceholder="Пошук за типом, провайдером, статусом, заявкою або треком"
                emptyText="У вас ще немає доставок"
            />

            {viewItem && (
                <ViewDeliveryModal
                    delivery={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}
        </div>
    );
}
