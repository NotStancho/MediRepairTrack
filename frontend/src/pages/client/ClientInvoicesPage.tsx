// pages/client/ClientInvoicesPage.tsx

import { useAuth } from '../../context/AuthContext';

import InvoicesTab from '../finance/tabs/InvoicesTab';

export default function ClientInvoicesPage() {
    const { user } = useAuth();

    if (!user?.clientId) {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Рахунки</h1>
                    <p className="text-sm text-ink-muted">
                        Перегляд виставлених вам рахунків і їх позицій.
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
            <InvoicesTab
                scope="client"
                clientId={user.clientId}
                storageKey="client-invoices-table"
                globalFilterPlaceholder="Пошук за номером рахунку, заявкою або статусом"
                emptyText="У вас ще немає рахунків"
            />
        </div>
    );
}
