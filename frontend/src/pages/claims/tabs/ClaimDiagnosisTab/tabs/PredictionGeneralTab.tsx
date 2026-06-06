// pages/claims/tabs/ClaimDiagnosisTab/tabs/PredictionGeneralTab.tsx

import { useState } from 'react';

import type { DiagnosisPrediction } from '../../../../../types/diagnosis/DSS/diagnosisPrediction';
import { formatMoney } from '../../../../../utils/formats/moneyFormat';
import { formatDateTime } from '../../../../../utils/formats/dateFormat';
import Badge from '../../../../../components/badges/Badge';
import ComplexityLevelBadge from '../../../../../components/badges/ComplexityLevelBadge';
import MetricCard from '../../../../../components/MetricCard';
import ConfirmBox from '../../../../../ui/ConfirmBox';

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
    const [recalculateConfirmOpen, setRecalculateConfirmOpen] = useState(false);

    const formatPercent = (value: number) =>
        `${(value * 100).toFixed(1)}%`;

    const canRegenerateExplanation =
        prediction.predictionSource === 'AUTOMATED' && !!onRegenerateExplanation;
    const canRecalculate =
        prediction.predictionSource !== 'AUTOMATED' && !!onRecalculate;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <Badge
                        colorClassName="bg-gray-100 text-gray-600"
                        shape="rounded"
                    >
                        {prediction.modelVersion}
                    </Badge>

                    <span>
                        Створено: {formatDateTime(prediction.createdAt)}
                    </span>

                    {prediction.updatedAt && (
                        <>
                            <span>·</span>
                            <span>
                                Оновлено: {formatDateTime(prediction.updatedAt)}
                            </span>
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {canRecalculate && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setRecalculateConfirmOpen(true);
                            }}
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

                    {onEdit && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="
                                flex items-center justify-center
                                w-8 h-8
                                rounded-lg border border-border
                                bg-surface
                                hover:bg-brand-soft hover:border-brand
                                transition
                                shadow-sm
                            "
                            title="Редагувати прогноз"
                        >
                            <FiEdit2 size={14} className="text-ink-muted" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <MetricCard
                    label="Оцінка вартості"
                    value={`${formatMoney(prediction.predictedCost)} ₴`}
                />

                <MetricCard
                    label="Оцінка часу"
                    value={`${prediction.predictedTimeHours} год`}
                />

                <MetricCard
                    label="Складність"
                    value={
                        <ComplexityLevelBadge
                            level={prediction.predictedComplexityLevel}
                            shape="rounded"
                        />
                    }
                />

                <MetricCard
                    label="Ймовірність гарантії"
                    value={formatPercent(prediction.predictedWarrantyProbability)}
                />

                <MetricCard
                    label="Середня схожість"
                    value={formatPercent(prediction.confidenceScore)}
                    helper="За знайденими історичними кейсами"
                />
            </div>

            <section className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-medium text-ink">
                            Пояснення прогнозу
                        </div>
                        <div className="text-xs text-ink-muted">
                            Текстове пояснення сформоване на основі поточних даних прогнозу
                        </div>
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
                            {regeneratingExplanation ? 'Генерація...' : 'Перегенерувати пояснення'}
                        </button>
                    )}
                </div>

                <div className="
                    rounded-xl border border-border bg-surface-muted
                    p-4 text-sm text-ink
                    whitespace-pre-line
                ">
                    {prediction.predictionExplanation?.trim()
                        ? prediction.predictionExplanation
                        : (
                            <span className="text-ink-muted italic">
                                Пояснення прогнозу ще не сформовано
                            </span>
                    )}
                </div>
            </section>

            {recalculateConfirmOpen && (
                <ConfirmBox
                    title="Перерахувати оцінки прогнозу?"
                    description="Система перерахує підсумкові оцінки часу, вартості та складності. Список схожих заявок, прогнозованих дефектів, робіт і запчастин не зміниться."
                    confirmText="Перерахувати"
                    cancelText="Скасувати"
                    onConfirm={() => {
                        onRecalculate?.();
                        setRecalculateConfirmOpen(false);
                    }}
                    onCancel={() => setRecalculateConfirmOpen(false)}
                />
            )}
        </div>
    );
}
