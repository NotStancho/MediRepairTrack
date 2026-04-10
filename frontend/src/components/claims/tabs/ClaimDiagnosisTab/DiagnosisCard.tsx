// components/claims/tabs/ClaimDiagnosisTab/DiagnosisCard.tsx

import { useState } from 'react';

import type { Diagnosis, DiagnosisStatus } from '../../../../types/diagnosis/diagnosis';

import {
    DIAGNOSIS_TYPE_LABELS,
    DIAGNOSIS_TYPE_COLORS,
} from '../../../../utils/diagnosisLabels';

import { formatDateTime } from '../../../../utils/dateFormat';
import { formatMoney } from '../../../../utils/moneyFormat';

import DiagnosisStatusActions from './DiagnosisStatusActions';

import ConfirmBox from '../../../../ui/ConfirmBox';

import { FiEdit2 } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

interface Props {
    diagnosis: Diagnosis;
    selected?: boolean;
    onClick?: () => void;
    onEdit?: () => void;

    allowedStatuses?: DiagnosisStatus[];
    allowedStatusesLoading?: boolean;

    confirming?: boolean;
    rejecting?: boolean;
    archiving?: boolean;
    deleting?: boolean;

    onConfirm?: () => Promise<void>;
    onReject?: () => Promise<void>;
    onArchive?: () => Promise<void>;
    onDelete?: () => Promise<void> | void;
}

export default function DiagnosisCard({
                                          diagnosis,
                                          selected = false,
                                          onClick,
                                          onEdit,

                                          allowedStatuses, allowedStatusesLoading,

                                          confirming, rejecting, archiving, deleting,
                                          onConfirm, onReject, onArchive, onDelete,
                                      }: Props) {

    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div
            onClick={onClick}
            className={`
            relative
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

                        <DiagnosisStatusActions
                            diagnosis={diagnosis}
                            allowedStatuses={allowedStatuses ?? []}
                            allowedStatusesLoading={allowedStatusesLoading ?? false}

                            confirming={confirming ?? false}
                            rejecting={rejecting ?? false}
                            archiving={archiving ?? false}

                            onConfirm={onConfirm ?? (async () => {})}
                            onReject={onReject ?? (async () => {})}
                            onArchive={onArchive ?? (async () => {})}
                        />
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

                {diagnosis.status === 'DRAFT' && onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteOpen(true);
                        }}
                        disabled={deleting}
                        className="
                            absolute top-3 right-12
                            flex items-center justify-center
                            w-8 h-8
                            rounded-lg border border-border
                            bg-surface
                            hover:bg-red-50 hover:border-red-300
                            transition
                            shadow-sm
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    >
                        <FiTrash2 size={14} className="text-red-500" />
                    </button>
                )}

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

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm shrink-0 pr-12">
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

            {deleteOpen && (
                <ConfirmBox
                    title="Видалити діагностику?"
                    description="Цю дію неможливо скасувати."
                    confirmText="Так, видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await onDelete?.();
                        setDeleteOpen(false);
                    }}
                    onCancel={() => setDeleteOpen(false)}
                />
            )}
        </div>
    );
}