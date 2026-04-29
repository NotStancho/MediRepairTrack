// pages/directories/DirectoriesPage.tsx

import { useState } from 'react';

import Tabs, { type TabItem } from '../../ui/Tabs';

import ComplexityLevelsTab from './tabs/ComplexityLevelsTab';
import DefectCategoriesTab from './tabs/DefectCategoriesTab';
import RepairWorksTab from './tabs/RepairWorksTab';

const tabs: TabItem[] = [
    { key: 'defect-categories', label: 'Категорії дефектів' },
    { key: 'repair-works', label: 'Ремонтні роботи' },
    { key: 'complexity-levels', label: 'Рівні складності' },
];

export default function DirectoriesPage() {
    const [active, setActive] = useState('defect-categories');

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} active={active} onChange={setActive}>
                {active === 'defect-categories' && <DefectCategoriesTab />}
                {active === 'repair-works' && <RepairWorksTab />}
                {active === 'complexity-levels' && <ComplexityLevelsTab />}
            </Tabs>
        </div>
    );
}
