// components/claims/tabs/ClaimDiagnosisTab/PredictionSection.tsx

import { usePrediction } from '../../../../hooks/diagnosis/useDiagnosisPrediction';
import PredictionCard from './PredictionCard';
import PredictionTabs from './PredictionTabs';

interface Props {
    diagnosisId: number;
}

export default function PredictionSection({ diagnosisId }: Props) {
    const {
        prediction,
        loading,
        recalculate
    } = usePrediction(diagnosisId);

    if (loading) {
        return (
            <div className="text-sm text-ink-muted">
                Завантаження прогнозу
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="text-sm text-ink-muted italic">
                Прогноз ще не створено
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PredictionCard
                prediction={prediction}
                onRecalculate={() => recalculate(prediction.id)}
            />

            <PredictionTabs predictionId={prediction.id} />

        </div>
    );
}