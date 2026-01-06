import {useState} from "react";

import type { Claim } from '../../types/claim';
import ClaimDetailsTab from "./tabs/ClaimDetailsTab.tsx";
import ClaimHistoryTab from "./tabs/ClaimHistoryTab.tsx";
import ClaimEmployeesTab from "./tabs/ClaimEmployeesTab";
import ClaimPartsTab from "./tabs/ClaimPartsTab";
import ClaimDeliveryTab from "./tabs/ClaimDeliveryTab";
import ClaimInvoiceTab from "./tabs/ClaimInvoiceTab";
import ClaimPaymentTab from "./tabs/ClaimPaymentTab";

interface Props {
    claim: Claim;
}

const tabs = [
    { key: 'details', label: 'Деталі' },
    { key: 'history', label: 'Історія' },
    { key: 'employees', label: 'Працівники' },
    { key: 'parts', label: 'Запчастини' },
    { key: 'delivery', label: 'Доставка' },
    { key: 'invoice', label: 'Рахунок' },
    { key: 'payment', label: 'Оплата' },
];

export default function ClaimTabs({ claim }: Props) {
    const [active, setActive] = useState('details');

    return (
        <div className="space-y-4">
            {/* Tabs header */}
            <div className="flex gap-2 border-b">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActive(tab.key)}
                        className={`px-3 py-2 text-sm border-b-2 transition ${
                            active === tab.key
                                ? 'border-blue-600 text-blue-600 font-medium'
                                : 'border-transparent text-gray-600 hover:text-blue-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tabs content */}
            <div className="p-4 rounded bg-white">
                {active === 'details' && (
                    <ClaimDetailsTab claim={claim} />
                )}

                {active === 'history' && (
                    <ClaimHistoryTab claimId={claim.id} />
                )}

                {active === 'employees' && (
                    <ClaimEmployeesTab claimId={claim.id} />
                )}

                {active === 'parts' && (
                    <ClaimPartsTab claimId={claim.id} />
                )}

                {active === 'delivery' && (
                    <ClaimDeliveryTab claimId={claim.id} />
                )}

                {active === 'invoice' && (
                    <ClaimInvoiceTab claimId={claim.id} />
                )}

                {active === 'payment' && (
                    <ClaimPaymentTab claimId={claim.id} />
                )}
            </div>
        </div>
    );
}
