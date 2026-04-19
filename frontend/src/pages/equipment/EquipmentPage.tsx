// pages/equipment/EquipmentPage.tsx

import { useState } from 'react';
import Tabs, { type TabItem } from '../../ui/Tabs';

import EquipmentListTab from './tabs/EquipmentListTab';
import EquipmentModelsTab from './tabs/EquipmentModelsTab';

const tabs: TabItem[] = [
    { key: 'equipment', label: 'Обладнання' },
    { key: 'models', label: 'Моделі' },
];

export default function EquipmentPage() {
    const [active, setActive] = useState('equipment');

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} active={active} onChange={setActive}>
                {active === 'equipment' && <EquipmentListTab />}
                {active === 'models' && <EquipmentModelsTab />}
            </Tabs>
        </div>
    );
}