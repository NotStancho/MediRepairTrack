// pages/claims/tabs/ClaimDiagnosisTab/modals/ViewPredictedWorkModal

import { useMemo, type ReactNode } from 'react';

import { usePredictedWorkParts } from '../../../../../hooks/diagnosis/usePredictedWorkParts';

import type { PredictedWorkPart } from '../../../../../types/diagnosis/DSS/predictedWorkPart';
import type { PredictedWork } from '../../../../../types/diagnosis/DSS/predictedWork';

import Button from '../../../../../ui/Button';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import { Table, type TableColumnDef } from '../../../../../ui/Table';

import { formatDateTime } from '../../../../../utils/formats/dateFormat';
import { formatHours } from '../../../../../utils/formats/hourFormat';
import { formatMoney } from '../../../../../utils/formats/moneyFormat';
import { formatPartQuantity } from '../../../../../utils/formats/partQuantityFormat';

interface Props {
    predictedWork: PredictedWork;
    onClose: () => void;
}

function formatPercent(value: number) {
    return `${(value * 100).toFixed(1)}%`;
}

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

export default function ViewPredictedWorkModal({
    predictedWork,
    onClose,
}: Props) {
    const {
        data: parts,
        loading: partsLoading,
    } = usePredictedWorkParts(
        predictedWork.predictionId,
        predictedWork.repairWork.id,
    );

    const partsTotal = useMemo(
        () => parts.reduce(
            (sum, part) => sum + part.predictedQuantity * part.part.price,
            0,
        ),
        [parts],
    );

    const partColumns = useMemo<TableColumnDef<PredictedWorkPart>[]>(() => [
        {
            id: 'part',
            header: 'Запчастина',
            accessorFn: row => `${row.part.partName} ${row.part.partCode}`,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="truncate font-medium text-ink">
                        {row.original.part.partName}
                    </div>
                    <div className="truncate text-xs text-ink-muted">
                        {row.original.part.partCode}
                    </div>
                </div>
            ),
        },
        {
            id: 'quantity',
            header: 'Кількість',
            accessorFn: row => formatPartQuantity(row.predictedQuantity, row.part.unitName),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatPartQuantity(row.original.predictedQuantity, row.original.part.unitName)}
                </span>
            ),
        },
        {
            id: 'probability',
            header: 'Ймовірність',
            accessorFn: row => row.probabilityScore,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatPercent(row.original.probabilityScore)}
                </span>
            ),
        },
        {
            id: 'price',
            header: 'Ціна',
            accessorFn: row => String(row.part.price),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatMoney(row.original.part.price)} ₴
                </span>
            ),
        },
        {
            id: 'total',
            header: 'Каталожна сума',
            accessorFn: row => String(row.predictedQuantity * row.part.price),
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono font-semibold text-ink">
                    {formatMoney(row.original.predictedQuantity * row.original.part.price)} ₴
                </span>
            ),
        },
        {
            id: 'rank',
            header: 'Позиція',
            accessorFn: row => row.rankPosition ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {row.original.rankPosition ?? '—'}
                </span>
            ),
        },
        {
            id: 'date',
            header: 'Дата',
            accessorFn: row => row.createdAt,
            cell: ({ row }) => (
                <div>
                    Додано:{' '}
                    <span className="text-ink">
                            {formatDateTime(row.original.createdAt)}
                        </span>
                </div>
            ),
        },
    ], []);

    return (
        <Modal
            title={`Прогнозована ремонтна робота: ${predictedWork.repairWork.name}`}
            onClose={onClose}
            width="xl"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Прогнозована ремонтна робота
                            </div>
                            <div className="mt-2 text-xl font-semibold text-ink">
                                {predictedWork.repairWork.name}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-ink-muted">
                                <div>
                                    Складність: {predictedWork.repairWork.complexityLevelName ?? '—'}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink">
                                {formatPercent(predictedWork.probabilityScore)}
                            </span>
                            <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink">
                                {formatHours(predictedWork.predictedTimeSpent, '0 год')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Ймовірність"
                        value={formatPercent(predictedWork.probabilityScore)}
                        mono
                    />
                    <InfoCard
                        label="Прогнозований час"
                        value={formatHours(predictedWork.predictedTimeSpent, '0 год')}
                        mono
                    />
                    <InfoCard
                        label="Позиція"
                        value={predictedWork.rankPosition ?? '—'}
                        mono
                    />
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(predictedWork.createdAt)}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm font-medium text-ink">
                            Прогнозовані запчастини
                        </div>
                        <div className="rounded border border-border bg-surface px-3 py-1 text-sm">
                            <span className="text-ink-muted">Каталожна сума: </span>
                            <span className="font-mono font-semibold text-ink">
                                {formatMoney(partsTotal)} ₴
                            </span>
                        </div>
                    </div>

                    <Table
                        data={parts}
                        columns={partColumns}
                        loading={partsLoading}
                        density="compact"
                        striped
                        storageKey={`predicted-work-view-parts-${predictedWork.predictionId}-${predictedWork.repairWork.id}`}
                        showPagination={false}
                        renderEmptyState={
                            <div className="text-sm text-ink-muted">
                                Немає прогнозованих запчастин
                            </div>
                        }
                    />
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
