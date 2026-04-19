import { useMemo, useState } from 'react';

import { useComplexityLevels } from '../../../hooks/diagnosis/useComplexityLevels';

import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import CreateComplexityLevelModal from '../modals/CreateComplexityLevelModal';
import EditComplexityLevelModal from '../modals/EditComplexityLevelModal';
import ViewComplexityLevelModal from '../modals/ViewComplexityLevelModal';

export default function ComplexityLevelsTab() {
    const {
        data,
        loading,
        loadOne,
        create,
        update,
        remove,
        creating,
        updating,
        deletingId,
    } = useComplexityLevels();

    const [viewItem, setViewItem] = useState<ComplexityLevel | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ComplexityLevel | null>(null);
    const [deleteItem, setDeleteItem] = useState<ComplexityLevel | null>(null);

    const handleView = (item: ComplexityLevel) => {
        setViewItem(item);

        void loadOne(item.id).then(fresh => {
            if (fresh) {
                setViewItem(current => (current?.id === fresh.id ? fresh : current));
            }
        });
    };

    const columns = useMemo<TableColumnDef<ComplexityLevel>[]>(() => [
        {
            id: 'name',
            header: 'Рівень',
            accessorFn: row => row.name,
            cell: ({ row }) => (
                <div className="font-medium text-ink">
                    {row.original.name}
                </div>
            ),
        },
        {
            id: 'description',
            header: 'Опис',
            accessorFn: row => row.description,
            cell: ({ row }) => (
                <div className="max-w-2xl text-sm text-ink-muted line-clamp-3">
                    {row.original.description}
                </div>
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
                storageKey="complexity-levels-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою чи описом"
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
                        Рівні складності ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreateComplexityLevelModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditComplexityLevelModal
                    level={editingItem}
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

            {viewItem && (
                <ViewComplexityLevelModal
                    level={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити рівень складності?"
                    description={deleteItem.name}
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
