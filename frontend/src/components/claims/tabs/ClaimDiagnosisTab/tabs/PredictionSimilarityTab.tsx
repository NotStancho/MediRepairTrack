import { useMemo, useState } from 'react';

import { useSimilarityResults } from '../../../../../hooks/diagnosis/useSimilarityResults';

import type { SimilarityResult } from '../../../../../types/diagnosis/DSS/similarityResult';

import { Table, type TableColumnDef } from '../../../../../ui/Table';
import TableToolbar from '../../../../../ui/Table/TableToolbar';
import Button from '../../../../../ui/Button';
import ConfirmBox from '../../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../../ui/RowActionsMenu';

import {
    CLAIM_STATUS_LABELS, REPAIR_TYPE_LABELS,
    STATUS_COLORS, REPAIR_TYPE_COLORS
} from '../../../../../utils/claimLabels';

import CreateSimilarityResultModal from '../modals/CreateSimilarityResultModal';
import EditSimilarityResultModal from '../modals/EditSimilarityResultModal';

interface Props {
    predictionId: number;
}

export default function PredictionSimilarityTab({ predictionId }: Props) {
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
    } = useSimilarityResults(predictionId);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SimilarityResult | null>(null);
    const [deleteItem, setDeleteItem] = useState<SimilarityResult | null>(null);

    const columns = useMemo<TableColumnDef<SimilarityResult>[]>(() => [
        {
            id: 'claimId',
            header: 'Заявка',
            accessorFn: row => row.claim.id,
            cell: ({ row }) => (
                <div className="font-mono text-sm">
                    №{row.original.claim.id}
                </div>
            ),
        },
        {
            id: 'equipment',
            header: 'Обладнання',
            accessorFn: row => row.claim.equipmentModel,
            cell: ({ row }) => (
                <div className="min-w-0">
                    <div className="font-medium text-ink">
                        {row.original.claim.equipmentModel}
                    </div>
                    <div className="text-xs text-ink-muted">
                        Серійний номер: {row.original.claim.serialNumber}
                    </div>
                </div>
            ),
        },
        {
            id: 'defectDescription',
            header: 'Опис несправності',
            accessorFn: row => row.claim.defectDescription,
            cell: ({ row }) => (
                <div
                    className="text-sm text-ink-muted truncate max-w-[420px]"
                    title={row.original.claim.defectDescription}
                >
                    {row.original.claim.defectDescription}
                </div>
            ),
        },
        {
            id: 'repairType',
            header: 'Тип ремонту',
            accessorFn: row => row.claim.repairType,
            cell: ({ row }) => {
                const type = row.original.claim.repairType;

                return (
                    <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${REPAIR_TYPE_COLORS[type]}
            `}>
                {REPAIR_TYPE_LABELS[type]}
            </span>
                );
            },
        },
        {
            id: 'status',
            header: 'Статус',
            accessorFn: row => row.claim.status,
            cell: ({ row }) => {
                const status = row.original.claim.status;

                return (
                    <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${STATUS_COLORS[status]}
            `}>
                {CLAIM_STATUS_LABELS[status]}
            </span>
                );
            },
        },
        {
            id: 'similarity',
            header: 'Схожість',
            accessorFn: row => row.similarityScore,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {(row.original.similarityScore * 100).toFixed(1)}%
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
                        Схожі заявки
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
                    + Додати заявку
                </Button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                showPagination={false}
                storageKey="prediction-similarity-tab"
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за ID, моделлю, серійним номером або описом"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted italic">
                        Схожі заявки ще не додано
                    </div>
                }
            />

            {createOpen && (
                <CreateSimilarityResultModal
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
                <EditSimilarityResultModal
                    similarity={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.claim.id, payload);
                        setEditingItem(null);
                    }}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити схожу заявку?"
                    description={`Заявка #${deleteItem.claim.id} буде видалена з результатів схожості.`}
                    confirmText={removing ? 'Видалення...' : 'Так, видалити'}
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.claim.id);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}