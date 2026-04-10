// components/claims/tabs/ClaimDiagnosisTab/DiagnosisCard.tsx

import type { Diagnosis } from '../../../../types/diagnosis/diagnosis';
import { formatDateTime } from '../../../../utils/dateFormat';
import {
    DIAGNOSIS_STATUS_LABELS,
    DIAGNOSIS_STATUS_COLORS,
    DIAGNOSIS_TYPE_LABELS,
    DIAGNOSIS_TYPE_COLORS,
} from '../../../../utils/diagnosisLabels';
import { formatMoney } from '../../../../utils/moneyFormat';

interface Props {
    diagnosis: Diagnosis;
    selected?: boolean;
    onClick?: () => void;
}

export default function DiagnosisCard({
                                          diagnosis,
                                          selected = false,
                                          onClick,
                                      }: Props) {
    return (
        <div
            onClick={onClick}
            className={`
            w-full text-left rounded-lg border p-4 transition-all cursor-pointer
            ${selected
                ? 'border-brand bg-brand-soft shadow-sm'
                : 'border-border bg-surface hover:border-brand/40 hover:bg-brand-soft/40'}
            `}
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">
                            Діагностика #{diagnosis.id}
                        </span>

                        <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${DIAGNOSIS_TYPE_COLORS[diagnosis.diagnosisType]}`}
                        >
                            {DIAGNOSIS_TYPE_LABELS[diagnosis.diagnosisType]}
                        </span>

                        <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${DIAGNOSIS_STATUS_COLORS[diagnosis.status]}`}
                        >
                            {DIAGNOSIS_STATUS_LABELS[diagnosis.status]}
                        </span>
                    </div>

                    <div className="text-sm text-ink-muted">
                        Створено: {formatDateTime(diagnosis.createdAt)}
                    </div>

                    {diagnosis.confirmedAt && (
                        <div className="text-sm text-ink-muted">
                            Підтверджено: {formatDateTime(diagnosis.confirmedAt)}
                        </div>
                    )}

                    <div className="space-y-2 text-sm text-ink">
                        {diagnosis.finalConclusion?.trim() && (
                            <div>
                                <div className="text-ink-muted">
                                    Фінальний висновок
                                </div>
                                <div className="whitespace-pre-line font-medium">
                                    {diagnosis.finalConclusion}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="text-ink-muted">
                                Попередній висновок
                            </div>
                            <div className="whitespace-pre-line">
                                {diagnosis.preliminaryConclusion?.trim() ? (
                                    diagnosis.preliminaryConclusion
                                ) : (
                                    <span className="text-ink-muted italic">
                                        немає попереднього висновку
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm shrink-0">
                    <div>
                        <div>
                            <div className="text-ink-muted">Оцінка вартості</div>
                            <div className="font-medium text-ink">
                                {diagnosis.estimatedCost != null
                                    ? `${formatMoney(diagnosis.estimatedCost)} ₴`
                                    : <span className="text-ink-muted italic">не вказано</span>
                                }
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-ink-muted">Оцінка часу</div>
                        <div className="font-medium text-ink">
                            {diagnosis.estimatedTimeHours != null
                                ? `${diagnosis.estimatedTimeHours} год`
                                : <span className="text-ink-muted italic">не вказано</span>
                            }
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="text-ink-muted">Інженер</div>
                        <div className="font-medium text-ink">
                            {diagnosis.engineerId ? (
                                diagnosis.engineerId
                            ) : (
                                <span className="text-ink-muted italic">не вказано</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}