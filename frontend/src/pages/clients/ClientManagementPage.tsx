// pages/clients/ClientManagementPage.tsx

import { useLocation, useNavigate } from 'react-router-dom';

import Tabs, { type TabItem } from '../../ui/Tabs';

import ClientsListTab from './tabs/ClientsListTab';
import ContractsTab from './tabs/ContractsTab';

const tabs: TabItem[] = [
    { key: 'clients', label: 'Клієнти' },
    { key: 'contracts', label: 'Контракти' },
];

export default function ClientManagementPage() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const active = pathname === '/contracts' ? 'contracts' : 'clients';

    const handleChange = (key: string) => {
        navigate(key === 'contracts' ? '/contracts' : '/clients');
    };

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} active={active} onChange={handleChange}>
                {active === 'clients' && <ClientsListTab />}
                {active === 'contracts' && <ContractsTab />}
            </Tabs>
        </div>
    );
}
