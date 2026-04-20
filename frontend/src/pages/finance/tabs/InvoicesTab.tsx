// pages/finance/tabs/InvoicesTab.tsx

import { useCallback, useState } from 'react';

import InvoicesTable from '../InvoicesTable';
import ViewInvoiceModal from '../modals/ViewInvoiceModal';

import { useInvoices } from '../../../hooks/useInvoices';

import type { Invoice, InvoiceFull } from '../../../types/invoice';

interface Props {
    scope?: 'all' | 'client';
    clientId?: number | null;
    showClientColumn?: boolean;
    storageKey: string;
    globalFilterPlaceholder: string;
    emptyText: string;
}

export default function InvoicesTab({
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
    } = useInvoices({
        scope,
        clientId,
    });

    const [viewItem, setViewItem] = useState<InvoiceFull | null>(null);

    const handleView = useCallback((invoice: Invoice) => {
        void loadOne(invoice.id).then(full => {
            if (full) {
                setViewItem(full);
            }
        });
    }, [loadOne]);

    return (
        <div>
            <InvoicesTable
                data={data}
                loading={loading}
                onView={handleView}
                storageKey={storageKey}
                globalFilterPlaceholder={globalFilterPlaceholder}
                emptyText={emptyText}
                showClientColumn={showClientColumn}
            />

            {viewItem && (
                <ViewInvoiceModal
                    invoice={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}
        </div>
    );
}
