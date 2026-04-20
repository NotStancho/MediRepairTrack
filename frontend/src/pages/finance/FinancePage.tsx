// finance/FinancePage.tsx

import Tabs, { type TabItem } from '../../ui/Tabs';

import InvoicesTab from './tabs/InvoicesTab';
import { useState } from 'react';

const tabs: TabItem[] = [
    { key: 'invoices', label: 'Рахунки' },
    { key: 'payments', label: 'Оплати' },
    { key: 'pricing-config', label: 'Налаштування цін' },
];

function Placeholder({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-muted">
            {text}
        </div>
    );
}

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
                    <Placeholder text="Таб оплати буде доданий наступним кроком." />
                )}

                {active === 'pricing-config' && (
                    <Placeholder text="Таб налаштування цін буде доданий наступним кроком." />
                )}
            </Tabs>
        </div>
    );
}
