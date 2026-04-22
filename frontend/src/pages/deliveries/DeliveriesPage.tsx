// pages/deliveries/DeliveriesPage.tsx

import { useCallback, useState } from 'react';
import { useDeliveries } from '../../hooks/useDeliveries';

import type { DeliveryView } from '../../types/delivery';

import DeliveriesTable from './DeliveriesTable';
import ViewDeliveryModal from './modals/ViewDeliveryModal';

export default function DeliveriesPage() {
    const {
        data,
        loading,
        loadOne,
    } = useDeliveries({
        scope: 'all',
    });

    const [viewItem, setViewItem] = useState<DeliveryView | null>(null);

    const handleView = useCallback((delivery: DeliveryView) => {
        void loadOne(delivery.id).then(item => {
            if (item) {
                setViewItem(item);
            }
        });
    }, [loadOne]);

    return (
        <div className="space-y-6">
            <DeliveriesTable
                data={data}
                loading={loading}
                onView={handleView}
                storageKey="deliveries-table"
                globalFilterPlaceholder="Пошук за клієнтом, типом, провайдером, статусом, заявкою або треком"
                emptyText="Доставки ще не створені"
                showClientColumn
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
