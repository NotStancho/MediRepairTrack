import { useMemo, useState } from 'react';

import { usePredictedOperations } from '../../../../../hooks/diagnosis/usePredictedOperations';

import type { PredictedOperation } from '../../../../../types/diagnosis/DSS/predictedOperation';

import { Table, type TableColumnDef } from '../../../../../ui/Table';
import TableToolbar from '../../../../../ui/Table/TableToolbar';
import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../../ui/RowActionsMenu';

import CreatePredictedOperationModal from '../modals/CreatePredictedOperationModal';
import EditPredictedOperationModal from '../modals/EditPredictedOperationModal';

interface Props {
    predictionId: number;
}

export default function PredictionOperationsTab({ predictionId }: Props) {
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
    } = usePredictedOperations(predictionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PredictedOperation | null>(null);
    const [deleteItem, setDeleteItem] = useState<PredictedOperation | null>(null);

    const columns = useMemo<TableColumnDef<PredictedOperation>[]>(() => [
        {
            id: 'name',
            header: 'Робота',
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
                        ? `${row.original.predictedTimeSpent} год`
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
                        <button
                            type="button"
                            className="
                                px-2 py-1 rounded
                                text-ink-muted
                                hover:bg-surface-muted hover:text-ink
                            "
                        >
                            ⋯
                        </button>
                    }
                />
            ),
        },
    ], []);

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
                    + Додати роботу
                </Button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                showPagination={false}
                storageKey="prediction-repair-works-tab"
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою, описом або складністю"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted italic">
                        Роботи ще не додано
                    </div>
                }
            />

            {createOpen && (
                <CreatePredictedOperationModal
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
                <EditPredictedOperationModal
                    operation={editingItem}
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
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}
