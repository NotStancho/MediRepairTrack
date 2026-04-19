import { useMemo, useState } from 'react';

import { usePredictedParts } from '../../../../../hooks/diagnosis/usePredictedParts';

import type { PredictedPart } from '../../../../../types/diagnosis/DSS/predictedPart';

import { Table, type TableColumnDef } from '../../../../../ui/Table';
import TableToolbar from '../../../../../ui/Table/TableToolbar';
import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../../ui/RowActionsMenu';

import CreatePredictedPartModal from '../modals/CreatePredictedPartModal';
import EditPredictedPartModal from '../modals/EditPredictedPartModal';

import { formatMoney } from '../../../../../utils/formats/moneyFormat';

interface Props {
    predictionId: number;
}

export default function PredictionPartsTab({ predictionId }: Props) {
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
    } = usePredictedParts(predictionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PredictedPart | null>(null);
    const [deleteItem, setDeleteItem] = useState<PredictedPart | null>(null);

    const columns = useMemo<TableColumnDef<PredictedPart>[]>(() => [
        {
            id: 'partCode',
            header: 'Код',
            accessorFn: row => row.part.partCode,
            cell: ({ row }) => (
                <span className="font-mono text-sm">
                    {row.original.part.partCode}
                </span>
            ),
        },
        {
            id: 'partName',
            header: 'Запчастина',
            accessorFn: row => row.part.partName,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="font-medium text-ink">
                        {row.original.part.partName}
                    </div>
                </div>
            ),
        },
        {
            id: 'price',
            header: 'Ціна',
            accessorFn: row => row.part.price ?? 0,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatMoney(row.original.part.price)} ₴
                </span>
            ),
        },
        {
            id: 'unit',
            header: 'Од.',
            accessorFn: row => row.part.unitName,
            cell: ({ row }) => row.original.part.unitName,
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
                        Прогнозовані запчастини
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
                    + Додати запчастину
                </Button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                showPagination={false}
                storageKey="prediction-parts-tab"
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за кодом, назвою або одиницею"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted italic">
                        Запчастини ще не додано
                    </div>
                }
            />

            {createOpen && (
                <CreatePredictedPartModal
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
                <EditPredictedPartModal
                    part={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.part.id, payload);
                        setEditingItem(null);
                    }}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити запчастину?"
                    description={`Запчастина "${deleteItem.part.partName}" буде видалена з прогнозу.`}
                    confirmText={removing ? 'Видалення...' : 'Так, видалити'}
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.part.id);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}