// pages/claims/tabs/ClaimDiagnosisTab/tabs/PredictionGeneralTab.tsx

import type { DiagnosisPrediction } from '../../../../../types/diagnosis/DSS/diagnosisPrediction';
import { formatMoney } from '../../../../../utils/formats/moneyFormat';
import { formatDateTime } from '../../../../../utils/formats/dateFormat';
import Badge from '../../../../../components/badges/Badge';

import { FiEdit2, FiRefreshCw } from 'react-icons/fi';

interface Props {
    prediction: DiagnosisPrediction;
    onRecalculate?: () => void;
    onRegenerateExplanation?: () => void;
    regeneratingExplanation?: boolean;
    onEdit?: () => void;
}

export default function PredictionGeneralTab({
                                           prediction,
                                           onRecalculate,
                                           onRegenerateExplanation,
                                           regeneratingExplanation,
                                           onEdit
                                       }: Props) {

    const formatPercent = (value: number) =>
        `${(value * 100).toFixed(1)}%`;

    const canRegenerateExplanation =
        prediction.predictionSource === 'AUTOMATED' && !!onRegenerateExplanation;

    return (
        <div className="relative space-y-4">

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
                        <Badge
                            colorClassName="bg-blue-100 text-blue-700"
                            shape="rounded"
                        >
                            {prediction.predictionSource}
                        </Badge>

                        <Badge
                            colorClassName="bg-gray-100 text-gray-600"
                            shape="rounded"
                        >
                            {prediction.modelVersion}
                        </Badge>
                        <div>
                            <div className="text-xs text-ink-muted">
                                Створено: {formatDateTime(prediction.createdAt)}
                                {prediction.updatedAt && (
                                    <>, оновлено: {formatDateTime(prediction.updatedAt)}</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {onRecalculate && (
                    <button
                        onClick={onRecalculate}
                        className="
                            inline-flex items-center gap-1.5
                            text-xs font-medium text-brand
                            hover:underline
                        "
                    >
                        <FiRefreshCw size={13} />
                        Перерахувати оцінки
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
                    <div className="text-ink-muted">Середня схожість</div>
                    <div className="font-mono">
                        {formatPercent(prediction.confidenceScore)}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="text-ink-muted text-sm">
                        Пояснення
                    </div>

                    {canRegenerateExplanation && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                void onRegenerateExplanation?.();
                            }}
                            disabled={regeneratingExplanation}
                            className="
                                inline-flex items-center gap-1.5
                                text-xs font-medium text-brand
                                hover:underline
                                disabled:cursor-not-allowed disabled:text-ink-muted disabled:no-underline
                            "
                        >
                            <FiRefreshCw
                                size={13}
                                className={regeneratingExplanation ? 'animate-spin' : ''}
                            />
                            {regeneratingExplanation ? 'Генерація...' : 'Перегенерувати'}
                        </button>
                    )}
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
