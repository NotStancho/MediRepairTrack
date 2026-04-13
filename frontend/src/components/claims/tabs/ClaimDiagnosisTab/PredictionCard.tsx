// components/claims/tabs/ClaimDiagnosisTab/PredictionCard.tsx

import type { DiagnosisPrediction } from '../../../../types/diagnosis/DSS/diagnosisPrediction';
import { formatMoney } from '../../../../utils/moneyFormat';

import { FiEdit2 } from 'react-icons/fi';

interface Props {
    prediction: DiagnosisPrediction;
    onRecalculate?: () => void;
    onEdit?: () => void;
}

export default function PredictionCard({
                                           prediction,
                                           onRecalculate,
                                           onEdit
                                       }: Props) {

    const formatPercent = (value: number) =>
        `${(value * 100).toFixed(1)}%`;

    return (
        <div className="relative rounded-lg border border-border bg-surface p-4 shadow-sm space-y-4">

            <div className="flex justify-between items-start pr-10">
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="
                            absolute top-3 right-3
                            flex items-center justify-center
                            w-8 h-8
                            rounded-lg border border-border
                            bg-surface
                            hover:bg-brand-soft hover:border-brand
                            transition
                            shadow-sm
                        "
                    >
                        <FiEdit2 size={14} className="text-ink-muted" />
                    </button>
                )}

                <div className="space-y-1">
                    <div className="font-medium">
                        Прогноз #{prediction.id}
                    </div>

                    <div className="flex gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                            {prediction.predictionSource}
                        </span>

                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {prediction.modelVersion}
                        </span>
                    </div>
                </div>

                {onRecalculate && (
                    <button
                        onClick={onRecalculate}
                        className="text-xs text-brand hover:underline"
                    >
                        Перерахувати
                    </button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-ink-muted">Оцінка вартості</div>
                    <div className="font-mono font-semibold">
                        {formatMoney(prediction.predictedCost)}
                    </div>
                </div>

                <div>
                    <div className="text-ink-muted">Оцінка часу</div>
                    <div className="font-mono font-semibold">
                        {prediction.predictedTimeHours} год
                    </div>
                </div>

                <div>
                    <div className="text-ink-muted">Ймовірність гарантії</div>
                    <div className="font-mono">
                        {formatPercent(prediction.predictedWarrantyProbability)}
                    </div>
                </div>

                <div>
                    <div className="text-ink-muted">Confidence</div>
                    <div className="font-mono">
                        {formatPercent(prediction.confidenceScore)}
                    </div>
                </div>
            </div>

            <div>
                <div className="text-ink-muted mb-1 text-sm">
                    Пояснення
                </div>

                <div className="
                    text-sm
                    whitespace-pre-line
                    bg-surface-muted
                    border border-border
                    rounded p-3
                ">
                    {prediction.predictionExplanation}
                </div>
            </div>

        </div>
    );
}