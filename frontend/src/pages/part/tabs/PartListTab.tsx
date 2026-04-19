//pages/part/tabs/PartListTab.tsx

import { useMemo, useState } from 'react';

import { usePart } from '../../../hooks/usePart';

import type { Part } from '../../../types/part/part';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import { formatMoney } from '../../../utils/formats/moneyFormat';
import { formatPartQuantity } from '../../../utils/formats/partQuantityFormat';
import {
    PART_UNIT_TYPE_COLORS,
    getPartUnitTypeLabel,
} from '../../../utils/partLabel';

import AddPartStockModal from '../modals/AddPartStockModal';
import CreatePartModal from '../modals/CreatePartModal';
import EditPartModal from '../modals/EditPartModal';
import ViewPartModal from '../modals/ViewPartModal';

export default function PartListTab() {
    const {
        data,
        loading,
        loadOne,
        create,
        update,
        addStock,
        remove,
        creating,
        updating,
        addingStockId,
        deletingId,
    } = usePart();

    const [viewItem, setViewItem] = useState<Part | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Part | null>(null);
    const [stockItem, setStockItem] = useState<Part | null>(null);
    const [deleteItem, setDeleteItem] = useState<Part | null>(null);

    const handleView = (item: Part) => {
        setViewItem(item);

        void loadOne(item.id).then(fresh => {
            if (fresh) {
                setViewItem(current => (current?.id === fresh.id ? fresh : current));
            }
        });
    };

    const columns = useMemo<TableColumnDef<Part>[]>(() => [
        {
            id: 'partCode',
            header: 'Код',
            accessorFn: row => row.partCode,
            meta: { cellClassName: 'font-mono text-ink-muted' },
        },
        {
            id: 'partName',
            header: 'Запчастина',
            accessorFn: row => `${row.partName} ${row.supplierName}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-ink">
                        {row.original.partName}
                    </div>
                    <div className="text-xs text-ink-muted">
                        Постачальник: {row.original.supplierName}
                    </div>
                </div>
            ),
        },
        {
            id: 'unit',
            header: 'Одиниця',
            accessorFn: row => `${row.unitName} ${getPartUnitTypeLabel(row.unitType)}`,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-ink">
                        {row.original.unitName}
                    </span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${PART_UNIT_TYPE_COLORS[row.original.unitType]}`}>
                        {getPartUnitTypeLabel(row.original.unitType)}
                    </span>
                </div>
            ),
        },
        {
            id: 'stockQuantity',
            header: 'Залишок',
            accessorFn: row => row.stockQuantity,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatPartQuantity(
                        row.original.stockQuantity,
                        row.original.unitName
                    )}
                </span>
            ),
        },
        {
            id: 'price',
            header: 'Ціна',
            accessorFn: row => row.price,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono">
                    {formatMoney(row.original.price)} грн
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Дії',
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <RowActionsMenu
                    disabled={deletingId === row.original.id}
                    actions={[
                        {
                            label: 'Редагувати',
                            onClick: () => setEditingItem(row.original),
                        },
                        {
                            label: 'Поповнити склад',
                            onClick: () => setStockItem(row.original),
                        },
                        {
                            label: 'Видалити',
                            onClick: () => setDeleteItem(row.original),
                            danger: true,
                        },
                    ]}
                    trigger={
                        <button className="rounded px-2 py-1 hover:bg-surface-muted">
                            ⋯
                        </button>
                    }
                />
            ),
        },
    ], [deletingId]);

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                storageKey="parts-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за кодом, назвою чи постачальником"
                        rightSlot={
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                            >
                                + Додати
                            </Button>
                        }
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Запчастини ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreatePartModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditPartModal
                    part={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.id, payload);
                        setEditingItem(updated);
                        setViewItem(current =>
                            current?.id === updated.id ? updated : current
                        );
                    }}
                />
            )}

            {stockItem && (
                <AddPartStockModal
                    part={stockItem}
                    adding={addingStockId === stockItem.id}
                    onClose={() => setStockItem(null)}
                    onSave={async payload => {
                        const updated = await addStock(stockItem.id, payload);
                        setStockItem(updated);
                        setViewItem(current =>
                            current?.id === updated.id ? updated : current
                        );
                    }}
                />
            )}

            {viewItem && (
                <ViewPartModal
                    part={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити запчастину?"
                    description={`${deleteItem.partCode} • ${deleteItem.partName}`}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.id);
                        setViewItem(current =>
                            current?.id === deleteItem.id ? null : current
                        );
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}
