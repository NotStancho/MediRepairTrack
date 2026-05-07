// pages/claims/tabs/ClaimDiagnosisTab/PredictionTabs.tsx

import { useState } from 'react';

import Tabs from '../../../../ui/Tabs';
import type { TabItem } from '../../../../ui/Tabs';

import type {DiagnosisPrediction} from "../../../../types/diagnosis/DSS/diagnosisPrediction";

import PredictionGeneralTab from './tabs/PredictionGeneralTab';
import PredictionWorksTab from './tabs/PredictionWorksTab';
import PredictionDefectsTab from './tabs/PredictionDefectsTab';
import PredictionSimilarityTab from './tabs/PredictionSimilarityTab';

const tabs: TabItem[] = [
    { key: 'general', label: 'Загальний' },
    { key: 'works', label: 'Ремонтні роботи' },
    { key: 'defects', label: 'Дефекти' },
    { key: 'similar', label: 'Схожі заявки' },
];

interface Props {
    prediction: DiagnosisPrediction;
    onRecalculate?: () => void;
    onEdit?: () => void;
}

export default function PredictionTabs({ prediction,
                                           onRecalculate,
                                           onEdit
                                        }: Props) {
    const [active, setActive] = useState('general');

    return (
        <Tabs tabs={tabs} active={active} onChange={setActive}>
            {active === 'general' && (
                <PredictionGeneralTab
                    prediction={prediction}
                    onRecalculate={onRecalculate}
                    onEdit={onEdit}
                />
            )}

            {active === 'works' && (
                <PredictionWorksTab predictionId={prediction.id} />
            )}

            {active === 'defects' && (
                <PredictionDefectsTab predictionId={prediction.id} />
            )}

            {active === 'similar' && (
                <PredictionSimilarityTab predictionId={prediction.id} />
            )}
        </Tabs>
    );
}
