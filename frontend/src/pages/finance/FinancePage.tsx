// finance/FinancePage.tsx

import Tabs, { type TabItem } from '../../ui/Tabs';

import InvoicesTab from './tabs/InvoicesTab';
import PaymentsTab from './tabs/PaymentsTab';
import PricingConfigTab from './tabs/PricingConfigTab';
import { useState } from 'react';

const tabs: TabItem[] = [
    { key: 'invoices', label: 'Рахунки' },
    { key: 'payments', label: 'Оплати' },
    { key: 'pricing-config', label: 'Налаштування цін' },
];

export default function FinancePage() {
    const [active, setActive] = useState<'invoices' | 'payments' | 'pricing-config'>('invoices');

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} active={active} onChange={(key) => setActive(key as typeof active)}>
                {active === 'invoices' && (
                    <InvoicesTab
                        scope="all"
                        showClientColumn
                        storageKey="finance-invoices-table"
                        globalFilterPlaceholder="Пошук за номером рахунку, клієнтом, заявкою або статусом"
                        emptyText="Рахунки ще не створені"
                    />
                )}

                {active === 'payments' && (
                    <PaymentsTab
                        scope="all"
                        showClientColumn
                        storageKey="finance-payments-table"
                        globalFilterPlaceholder="Пошук за рахунком, клієнтом, методом, статусом або reference"
                        emptyText="Оплати ще не створені"
                    />
                )}

                {active === 'pricing-config' && (
                    <PricingConfigTab />
                )}
            </Tabs>
        </div>
    );
}
