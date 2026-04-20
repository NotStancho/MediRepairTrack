// pages/finance/tabs/PaymentsTab.tsx

import { useCallback, useState } from 'react';

import PaymentsTable from '../PaymentsTable';
import ViewPaymentModal from '../modals/ViewPaymentModal';

import { usePaymentsList } from '../../../hooks/usePaymentsList';

import type { PaymentView } from '../../../types/payment';

interface Props {
    scope?: 'all' | 'client';
    clientId?: number | null;
    showClientColumn?: boolean;
    storageKey: string;
    globalFilterPlaceholder: string;
    emptyText: string;
}

export default function PaymentsTab({
    scope = 'all',
    clientId = null,
    showClientColumn = false,
    storageKey,
    globalFilterPlaceholder,
    emptyText,
}: Props) {
    const {
        data,
        loading,
        loadOne,
    } = usePaymentsList({
        scope,
        clientId,
    });

    const [viewItem, setViewItem] = useState<PaymentView | null>(null);

    const handleView = useCallback((payment: PaymentView) => {
        void loadOne(payment.id).then(full => {
            if (full) {
                setViewItem(full);
            }
        });
    }, [loadOne]);

    return (
        <div>
            <PaymentsTable
                data={data}
                loading={loading}
                onView={handleView}
                storageKey={storageKey}
                globalFilterPlaceholder={globalFilterPlaceholder}
                emptyText={emptyText}
                showClientColumn={showClientColumn}
            />

            {viewItem && (
                <ViewPaymentModal
                    payment={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}
        </div>
    );
}
