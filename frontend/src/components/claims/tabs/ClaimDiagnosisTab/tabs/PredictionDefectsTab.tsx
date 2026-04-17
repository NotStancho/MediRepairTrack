import { useMemo, useState } from 'react';

import { usePredictedDefects } from '../../../../../hooks/diagnosis/usePredictedDefects';

import type { PredictedDefectCategory } from '../../../../../types/diagnosis/DSS/predictedDefectCategory';

import { Table, type TableColumnDef } from '../../../../../ui/Table';
import TableToolbar from '../../../../../ui/Table/TableToolbar';
import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../../ui/RowActionsMenu';

import CreatePredictedDefectModal from '../modals/CreatePredictedDefectModal';
import EditPredictedDefectModal from '../modals/EditPredictedDefectModal';

interface Props {
    predictionId: number;
}

export default function PredictionDefectsTab({ predictionId }: Props) {
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
    } = usePredictedDefects(predictionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PredictedDefectCategory | null>(null);
    const [deleteItem, setDeleteItem] = useState<PredictedDefectCategory | null>(null);

    const columns = useMemo<TableColumnDef<PredictedDefectCategory>[]>(() => [
        {
            id: 'name',
            header: 'Категорія дефекту',
            accessorFn: row => row.defectCategory.name,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="font-medium text-ink">
                        {row.original.defectCategory.name}
                    </div>

                    {row.original.defectCategory.description && (
                        <div
                            className="text-xs text-ink-muted truncate max-w-[360px]"
                            title={row.original.defectCategory.description}
                        >
                            {row.original.defectCategory.description}
                        </div>
                    )}
                </div>
            ),
        },
        {
            id: 'symptoms',
            header: 'Типові симптоми',
            accessorFn: row => row.defectCategory.typicalSymptoms,
            cell: ({ row }) => (
                <div
                    className="text-sm text-ink-muted truncate max-w-[360px]"
                    title={row.original.defectCategory.typicalSymptoms}
                >
                    {row.original.defectCategory.typicalSymptoms}
                </div>
            ),
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
                        Прогнозовані дефекти
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
                    + Додати дефект
                </Button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                showPagination={false}
                storageKey="prediction-defects-tab"
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою, описом або симптомами"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted italic">
                        Дефекти ще не додано
                    </div>
                }
            />

            {createOpen && (
                <CreatePredictedDefectModal
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
                <EditPredictedDefectModal
                    defect={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.defectCategory.id, payload);
                        setEditingItem(null);
                    }}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити дефект?"
                    description={`Категорія "${deleteItem.defectCategory.name}" буде видалена з прогнозу.`}
                    confirmText={removing ? 'Видалення...' : 'Так, видалити'}
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.defectCategory.id);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}