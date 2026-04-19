// pages/equipment/tabs/EquipmentModelsTab.tsx

import { useMemo, useState } from 'react';

import { useEquipmentModels } from '../../../hooks/useEquipmentModels';
import type { EquipmentModel } from '../../../types/equipmentModel/equipmentModel';

import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';

import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';

import { EQUIPMENT_TYPE_COLORS, getEquipmentTypeLabel } from '../../../utils/equipmentLabel';

import CreateEquipmentModelModal from '../modals/CreateEquipmentModelModal';
import EditEquipmentModelModal from '../modals/EditEquipmentModelModal';
import ViewEquipmentModelModal from '../modals/ViewEquipmentModelModal';

export default function EquipmentModelsTab() {
    const {
        data,
        loading,
        create,
        update,
        remove,
        creating,
        updating,
    } = useEquipmentModels();

    const [viewItem, setViewItem] = useState<EquipmentModel | null>(null);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EquipmentModel | null>(null);
    const [deleteItem, setDeleteItem] = useState<EquipmentModel | null>(null);

    const columns = useMemo<TableColumnDef<EquipmentModel>[]>(() => [
        {
            id: 'name',
            header: 'Модель',
            accessorFn: row => row.modelName,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium">{row.original.modelName}</div>
                    <div className="text-xs text-ink-muted">
                        {row.original.manufacturer}
                    </div>
                </div>
            ),
        },
        {
            id: 'type',
            header: 'Тип',
            accessorFn: row => row.type,
            cell: ({ row }) => {
                const type = row.original.type;

                return (
                    <span className={`px-2 py-1 rounded text-xs ${EQUIPMENT_TYPE_COLORS[type]}`}>
                        {getEquipmentTypeLabel(type)}
                    </span>
                );
            }
        },
        {
            id: 'releaseDate',
            header: 'Дата випуску',
            accessorFn: row => row.releaseDate,
            cell: ({ row }) => formatDateShort(row.original.releaseDate),
        },
        {
            id: 'updatedAt',
            header: 'Оновлено',
            accessorFn: row => row.updatedAt,
            cell: ({ row }) =>
                row.original.updatedAt
                    ? formatDateTime(row.original.updatedAt)
                    : '-',
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
        },
    ], []);

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                loading={loading}
                density="compact"
                striped
                storageKey="equipment-models-table"
                onRowClick={(row) => setViewItem(row.original)}
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук моделей..."
                        rightSlot={
                            <Button variant="primary" onClick={() => setCreateOpen(true)}>
                                + Додати
                            </Button>
                        }
                    />
                )}
            />

            {createOpen && (
                <CreateEquipmentModelModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async (payload) => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditEquipmentModelModal
                    model={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async (payload) => {
                        await update(editingItem.id, payload);
                    }}
                />
            )}

            {viewItem && (
                <ViewEquipmentModelModal
                    model={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити модель обладнання?"
                    description={`Модель: ${deleteItem.modelName}`}
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