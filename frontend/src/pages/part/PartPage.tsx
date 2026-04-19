//pages/part/PartPage.tsx

import { useState } from 'react';

import Tabs, { type TabItem } from '../../ui/Tabs';

import PartListTab from './tabs/PartListTab';

const tabs: TabItem[] = [
    { key: 'parts', label: 'Запчастини' },
];

export default function PartPage() {
    const [active, setActive] = useState('parts');

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} active={active} onChange={setActive}>
                {active === 'parts' && <PartListTab />}
            </Tabs>
        </div>
    );
}
