// pages/client/ClientPaymentsPage.tsx

import { useAuth } from '../../context/AuthContext';

import PaymentsTab from '../finance/tabs/PaymentsTab';

export default function ClientPaymentsPage() {
    const { user } = useAuth();

    if (!user?.clientId) {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Оплати</h1>
                    <p className="text-sm text-ink-muted">
                        Перегляд зафіксованих оплат по ваших рахунках.
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
            <PaymentsTab
                scope="client"
                clientId={user.clientId}
                storageKey="client-payments-table"
                globalFilterPlaceholder="Пошук за рахунком, методом, статусом або reference"
                emptyText="У вас ще немає оплат"
            />
        </div>
    );
}
