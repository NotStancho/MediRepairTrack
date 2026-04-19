// pages/equipment/tabs/EquipmentListTab.tsx

import { useMemo, useState } from 'react';

import { useEquipmentModels } from '../../../hooks/useEquipmentModels';
import { useEquipment } from '../../../hooks/useEquipment';

import type { Equipment } from '../../../types/equipment/equipment';

import RowActionsMenu from '../../../ui/RowActionsMenu';
import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import { formatMoney } from '../../../utils/formats/moneyFormat';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';

import EditEquipmentModal from '../modals/EditEquipmentModal';
import CreateEquipmentModal from '../modals/CreateEquipmentModal';
import ViewEquipmentModal from '../modals/ViewEquipmentModal';

export default function EquipmentListTab() {
    const {
        data,
        loading,
        create,
        update,
        remove,
        creating,
        updating,
    } = useEquipment();

    const { shortData: models } = useEquipmentModels();

    const [viewItem, setViewItem] = useState<Equipment | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [deleteItem, setDeleteItem] = useState<Equipment | null>(null);

    const columns = useMemo<TableColumnDef<Equipment>[]>(() => [
        {
            id: 'model',
            header: 'Модель',
            accessorFn: row => row.model.modelName,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.model.modelName}</div>
                    <div className="text-xs text-ink-muted">
                        Виробник: {row.original.model.manufacturer}
                    </div>
                </div>
            ),
        },
        {
            id: 'serial',
            header: 'Серійний номер',
            accessorKey: 'serialNumber',
        },
        {
            id: 'purchaseDate',
            header: 'Дата купівлі',
            accessorFn: row => row.purchaseDate,
            cell: ({ row }) => formatDateShort(row.original.purchaseDate),
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
                        <button className="px-2 py-1 rounded hover:bg-surface-muted">
                            ⋯
                        </button>
                    }
                />
            ),
        }
    ], []);

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                storageKey="equipment-table"
                onRowClick={(row) => setViewItem(row.original)}
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук обладнання..."
                        rightSlot={
                            <Button variant="primary" onClick={() => setCreateOpen(true)}>
                                + Додати
                            </Button>
                        }
                    />
                )}
            />

            {createOpen && (
                <CreateEquipmentModal
                    models={models}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async (payload) => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditEquipmentModal
                    equipment={editingItem}
                    models={models}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.id, payload);
                    }}
                />
            )}

            {viewItem && (
                <ViewEquipmentModal
                    equipment={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити обладнання?"
                    description={`Серійний номер: ${deleteItem.serialNumber}`}
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.id);
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </div>
    );
}