// pages/claims/tabs/ClaimDiagnosisTab/tabs/PredictionWorksTab.tsx

import { useMemo, useState } from 'react';

import { usePredictedWorkParts } from '../../../../../hooks/diagnosis/usePredictedWorkParts';
import { usePredictedWorks } from '../../../../../hooks/diagnosis/usePredictedWorks';

import type { PredictedWorkPart } from '../../../../../types/diagnosis/DSS/predictedWorkPart';
import type { PredictedWork } from '../../../../../types/diagnosis/DSS/predictedWork';

import { Table, type TableColumnDef } from '../../../../../ui/Table';
import TableToolbar from '../../../../../ui/Table/TableToolbar';
import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../../ui/RowActionsMenu';

import CreatePredictedWorkModal from '../modals/CreatePredictedWorkModal';
import EditPredictedWorkModal from '../modals/EditPredictedWorkModal';
import PredictedWorkPartsModal from '../modals/PredictedWorkPartsModal';
import ViewPredictedWorkModal from '../modals/ViewPredictedWorkModal';

import { formatHours } from '../../../../../utils/formats/hourFormat';
import { formatPartQuantity } from '../../../../../utils/formats/partQuantityFormat';

interface Props {
    predictionId: number;
}

function buildPartsPreview(parts: PredictedWorkPart[]) {
    if (!parts.length) {
        return 'Немає прогнозованих запчастин';
    }

    const visible = parts.slice(0, 2).map(part =>
        `${formatPartQuantity(part.predictedQuantity, part.part.unitName)} ${part.part.partName}`,
    );

    const hiddenCount = parts.length - visible.length;

    return hiddenCount > 0
        ? `${visible.join(', ')} +${hiddenCount}`
        : visible.join(', ');
}

export default function PredictionWorksTab({ predictionId }: Props) {
    const {
        data,
        available,
        loading,

        creating,
        updating,
        removing,

        create,
        createBatch,
        update,
        remove,
    } = usePredictedWorks(predictionId);
    const {
        data: predictedParts,
        loading: predictedPartsLoading,
        refresh: refreshPredictedParts,
    } = usePredictedWorkParts(predictionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [viewItem, setViewItem] = useState<PredictedWork | null>(null);
    const [editingItem, setEditingItem] = useState<PredictedWork | null>(null);
    const [deleteItem, setDeleteItem] = useState<PredictedWork | null>(null);
    const [partsItem, setPartsItem] = useState<PredictedWork | null>(null);

    const partsByRepairWorkId = useMemo(() => {
        const grouped = new Map<number, PredictedWorkPart[]>();

        for (const part of predictedParts) {
            const group = grouped.get(part.repairWorkId) ?? [];
            group.push(part);
            grouped.set(part.repairWorkId, group);
        }

        return grouped;
    }, [predictedParts]);

    const columns = useMemo<TableColumnDef<PredictedWork>[]>(() => [
        {
            id: 'name',
            header: 'Ремонтна робота',
            accessorFn: row => row.repairWork.name,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="font-medium text-ink">
                        {row.original.repairWork.name}
                    </div>

                </div>
            ),
        },
        {
            id: 'parts',
            header: 'Запчастини',
            accessorFn: row => buildPartsPreview(partsByRepairWorkId.get(row.repairWork.id) ?? []),
            cell: ({ row }) => {
                const parts = partsByRepairWorkId.get(row.original.repairWork.id) ?? [];

                if (!parts.length) {
                    return (
                        <span className="text-xs text-ink-muted">
                            Немає прогнозованих запчастин
                        </span>
                    );
                }

                return (
                    <div className="min-w-0 space-y-1 text-xs">
                        {parts.slice(0, 2).map(part => (
                            <div key={part.part.id} className="truncate text-ink">
                                <span className="font-mono">
                                    {formatPartQuantity(part.predictedQuantity, part.part.unitName)}
                                </span>{' '}
                                {part.part.partName}
                            </div>
                        ))}

                        {parts.length > 2 && (
                            <div className="text-ink-muted">
                                Ще {parts.length - 2}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'complexity',
            header: 'Складність',
            accessorFn: row => row.repairWork.complexityLevelName ?? '',
            cell: ({ row }) => row.original.repairWork.complexityLevelName ?? '—',
        },
        {
            id: 'probability',
            header: 'Ймовірність',
            accessorFn: row => row.probabilityScore,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {(row.original.probabilityScore * 100).toFixed(1)}%
                </span>
            ),
        },
        {
            id: 'time',
            header: 'Час',
            accessorFn: row => row.predictedTimeSpent ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {row.original.predictedTimeSpent != null
                        ? formatHours(row.original.predictedTimeSpent)
                        : '—'}
                </span>
            ),
        },
        {
            id: 'rank',
            header: 'Позиція',
            accessorFn: row => row.rankPosition ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {row.original.rankPosition ?? '—'}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Дії',
            meta: { align: 'center', headerClassName: 'w-10' },
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <RowActionsMenu
                    actions={[
                        {
                            label: 'Запчастини',
                            onClick: () => setPartsItem(row.original),
                        },
                        {
                            label: 'Редагувати',
                            onClick: () => setEditingItem(row.original),
                        },
                        {
                            label: 'Видалити',
                            onClick: () => setDeleteItem(row.original),
                            danger: true,
                        },
                    ]}
                    trigger={
                        <span
                            className="
                                px-2 py-1 rounded
                                text-ink-muted
                                hover:bg-surface-muted hover:text-ink
                            "
                        >
                            ⋯
                        </span>
                    }
                />
            ),
        },
    ], [partsByRepairWorkId]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <div className="font-medium text-ink">
                        Прогнозовані ремонтні роботи
                    </div>
                    <div className="text-sm text-ink-muted">
                        Елементів: {data.length}
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="h-8 px-3 text-xs"
                    onClick={() => setCreateOpen(true)}
                >
                    + Додати ремонтну роботу
                </Button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={loading || predictedPartsLoading}
                density="compact"
                striped
                showPagination={false}
                storageKey="prediction-repair-works-tab"
                onRowClick={row => setViewItem(row.original)}
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за роботою, запчастиною або складністю"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted italic">
                        Ремонтні роботи ще не додано
                    </div>
                }
            />

            {createOpen && (
                <CreatePredictedWorkModal
                    predictionId={predictionId}
                    available={available}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async (payload) => {
                        await create(payload);
                        setCreateOpen(false);
                    }}
                    onCreateBatch={async (payload) => {
                        await createBatch(payload);
                        setCreateOpen(false);
                    }}
                />
            )}

            {editingItem && (
                <EditPredictedWorkModal
                    predictedWork={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.repairWork.id, payload);
                        setEditingItem(null);
                    }}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити роботу?"
                    description={`Робота "${deleteItem.repairWork.name}" буде видалена з прогнозу.`}
                    confirmText={removing ? 'Видалення...' : 'Так, видалити'}
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.repairWork.id);
                        await refreshPredictedParts();
                        setViewItem(current =>
                            current?.repairWork.id === deleteItem.repairWork.id
                                ? null
                                : current
                        );
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}

            {viewItem && (
                <ViewPredictedWorkModal
                    predictedWork={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {partsItem && (
                <PredictedWorkPartsModal
                    predictionId={predictionId}
                    repairWorkId={partsItem.repairWork.id}
                    repairWorkName={partsItem.repairWork.name}
                    onClose={() => setPartsItem(null)}
                    onChanged={async () => {
                        await refreshPredictedParts();
                    }}
                />
            )}
        </div>
    );
}
