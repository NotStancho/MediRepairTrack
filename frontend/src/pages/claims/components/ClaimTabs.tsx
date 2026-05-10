// pages/claims/components/ClaimTabs.tsx

import { useState } from 'react';

import type { Claim } from '../../../types/claim/claim';

import Tabs from '../../../ui/Tabs';
import type { TabItem } from '../../../ui/Tabs';

import ClaimDetailsTab from '../tabs/ClaimDetailsTab';
import ClaimHistoryTab from '../tabs/ClaimHistoryTab/ClaimHistoryTab';
import ClaimDiagnosisTab from '../tabs/ClaimDiagnosisTab/ClaimDiagnosisTab';
import ClaimEmployeesTab from '../tabs/ClaimEmployeesTab/ClaimEmployeesTab';
import ClaimWorksTab from '../tabs/ClaimWorksTab/ClaimWorksTab';
import ClaimPartsTab from '../tabs/ClaimPartsTab';
import ClaimDeliveryTab from '../tabs/ClaimDeliveryTab';
import ClaimInvoiceTab from '../tabs/ClaimInvoiceTab/ClaimInvoiceTab';
import ClaimPaymentTab from '../tabs/ClaimPaymentTab';

import {
    FiInfo,
    FiClock,
    FiActivity,
    FiUsers,
    FiTool,
    FiPackage,
    FiTruck,
    FiFileText,
    FiCreditCard,
} from 'react-icons/fi';

interface Props {
    claim: Claim;
    onClaimUpdated?: () => Promise<void> | void;
}

const tabs: TabItem[] = [
    { key: 'details', label: 'Деталі', icon: FiInfo },
    { key: 'history', label: 'Історія', icon: FiClock },
    { key: 'diagnosis', label: 'Діагностика', icon: FiActivity },
    { key: 'employees', label: 'Працівники', icon: FiUsers },
    { key: 'works', label: 'Ремонтні роботи', icon: FiTool },
    { key: 'parts', label: 'Запчастини', icon: FiPackage },
    { key: 'delivery', label: 'Доставка', icon: FiTruck },
    { key: 'invoice', label: 'Рахунок', icon: FiFileText },
    { key: 'payment', label: 'Оплата', icon: FiCreditCard },
];

export default function ClaimTabs({ claim, onClaimUpdated }: Props) {
    const [active, setActive] = useState('details');

    return (
        <Tabs tabs={tabs} active={active} onChange={setActive}>
            {active === 'details' && <ClaimDetailsTab claim={claim} />}
            {active === 'history' && <ClaimHistoryTab claimId={claim.id} />}
            {active === 'diagnosis' && <ClaimDiagnosisTab claimId={claim.id} />}
            {active === 'employees' && <ClaimEmployeesTab claimId={claim.id} />}
            {active === 'works' && (
                <ClaimWorksTab
                    claimId={claim.id}
                    onWorksChanged={onClaimUpdated}
                />
            )}
            {active === 'parts' && <ClaimPartsTab claimId={claim.id} />}
            {active === 'delivery' && <ClaimDeliveryTab claimId={claim.id} />}
            {active === 'invoice' && <ClaimInvoiceTab claimId={claim.id} />}
            {active === 'payment' && <ClaimPaymentTab claimId={claim.id} />}
        </Tabs>
    );
}
