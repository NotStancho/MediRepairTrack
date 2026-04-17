// components/claims/tabs/ClaimDiagnosisTab/PredictionSection.tsx

import { useState } from 'react';

import { usePrediction } from '../../../../hooks/diagnosis/useDiagnosisPrediction';
import PredictionTabs from './PredictionTabs';
import EditPredictionModal from './modals/EditPredictionModal';

interface Props {
    diagnosisId: number;
}

export default function PredictionSection({ diagnosisId }: Props) {
    const {
        prediction,
        loading,
        update,
        updating,
        recalculate
    } = usePrediction(diagnosisId);

    const [editOpen, setEditOpen] = useState(false);

    if (loading) {
        return (
            <div className="text-sm text-ink-muted">
                Завантаження прогнозу
            </div>
        );
    }

    if (!prediction) {
        return null;
    }

    return (
        <div className="space-y-4">
            <PredictionTabs
                prediction={prediction}
                onRecalculate={() => recalculate(prediction.id)}
                onEdit={() => setEditOpen(true)}
            />

            {editOpen && (
                <EditPredictionModal
                    prediction={prediction}
                    updating={updating}
                    onClose={() => setEditOpen(false)}
                    onSave={async (payload) => {
                        await update(prediction.id, payload);
                    }}
                />
            )}
        </div>
    );
}