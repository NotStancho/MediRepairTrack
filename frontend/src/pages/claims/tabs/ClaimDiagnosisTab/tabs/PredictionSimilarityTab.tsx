// pages/claims/tabs/ClaimDiagnosisTab/tabs/PredictionSimilarityTab.tsx

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
} from '../../../../../utils/claimLabels';
import ClaimStatusBadge from '../../../../../components/badges/ClaimStatusBadge';
import RepairTypeBadge from '../../../../../components/badges/RepairTypeBadge';

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
            id: 'claimSimilarity',
            header: 'Заявка / схожість',
            accessorFn: row => `${row.claim.id} ${(row.similarityScore * 100).toFixed(1)}%`,
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div className="font-mono text-sm font-medium">
                        №{row.original.claim.id}
                    </div>
                    <div className="font-mono text-xs text-ink-muted">
                        {(row.original.similarityScore * 100).toFixed(1)}% схожості
                    </div>
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
            id: 'repairStatus',
            header: 'Тип ремонту / статус',
            accessorFn: row => `${REPAIR_TYPE_LABELS[row.claim.repairType]} ${CLAIM_STATUS_LABELS[row.claim.status]}`,
            cell: ({ row }) => (
                <div className="flex flex-col items-start gap-1">
                    <RepairTypeBadge type={row.original.claim.repairType} shape="rounded" />
                    <ClaimStatusBadge status={row.original.claim.status} shape="rounded" />
                </div>
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
        <>
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
                        rightSlot={
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                            >
                                + Додати заявку
                            </Button>
                        }
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
        </>
    );
}
