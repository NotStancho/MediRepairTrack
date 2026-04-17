import { useState } from 'react';

import type { Claim } from '../../types/claim/claim';

import Tabs from '../../ui/Tabs';
import type { TabItem } from '../../ui/Tabs';

import ClaimDetailsTab from "./tabs/ClaimDetailsTab";
import ClaimHistoryTab from "./tabs/ClaimHistoryTab";
import ClaimDiagnosisTab from "./tabs/ClaimDiagnosisTab/ClaimDiagnosisTab";
import ClaimEmployeesTab from "./tabs/ClaimEmployeesTab";
import ClaimPartsTab from "./tabs/ClaimPartsTab";
import ClaimDeliveryTab from "./tabs/ClaimDeliveryTab";
import ClaimInvoiceTab from "./tabs/ClaimInvoiceTab";
import ClaimPaymentTab from "./tabs/ClaimPaymentTab";

import { FiInfo, FiClock, FiActivity, FiUsers, FiPackage, FiTruck, FiFileText, FiCreditCard } from 'react-icons/fi';

interface Props {
    claim: Claim;
}

const tabs: TabItem[] = [
    { key: 'details', label: 'Деталі', icon: FiInfo },
    { key: 'history', label: 'Історія', icon: FiClock },
    { key: 'diagnosis', label: 'Діагностика', icon: FiActivity },
    { key: 'employees', label: 'Працівники', icon: FiUsers },
    { key: 'parts', label: 'Запчастини', icon: FiPackage },
    { key: 'delivery', label: 'Доставка', icon: FiTruck },
    { key: 'invoice', label: 'Рахунок', icon: FiFileText },
    { key: 'payment', label: 'Оплата', icon: FiCreditCard },
];

export default function ClaimTabs({ claim }: Props) {
    const [active, setActive] = useState('details');

    return (
        <Tabs tabs={tabs} active={active} onChange={setActive}>
            {active === 'details' && <ClaimDetailsTab claim={claim} />}
            {active === 'history' && <ClaimHistoryTab claimId={claim.id} />}
            {active === 'diagnosis' && <ClaimDiagnosisTab claimId={claim.id} />}
            {active === 'employees' && <ClaimEmployeesTab claimId={claim.id} />}
            {active === 'parts' && <ClaimPartsTab claimId={claim.id} />}
            {active === 'delivery' && <ClaimDeliveryTab claimId={claim.id} />}
            {active === 'invoice' && <ClaimInvoiceTab claimId={claim.id} />}
            {active === 'payment' && <ClaimPaymentTab claimId={claim.id} />}
        </Tabs>
    );
}
