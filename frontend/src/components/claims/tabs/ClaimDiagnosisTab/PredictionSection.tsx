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
        create,
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
            <div className="space-y-2">
                <div className="text-sm text-ink-muted">
                    Прогноз ще не створено
                </div>

                <button
                    onClick={async () => {
                        await create({
                            diagnosisId,
                            predictedComplexityLevelId: 1, // TODO
                            predictedCost: 1,
                            predictedTimeHours: 1,
                            predictionExplanation: 'Manual prediction'
                        });
                    }}
                    className="text-sm text-brand hover:underline"
                >
                    + Створити прогноз
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* card */}
            <PredictionCard
                prediction={prediction}
                onRecalculate={() => recalculate(prediction.id)}
            />

            <PredictionTabs predictionId={prediction.id} />

        </div>
    );
}