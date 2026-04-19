// pages/directories/tabs/DefectCategoriesTab.tsx

import { useMemo, useState } from 'react';

import { useDefectCategories } from '../../../hooks/useDefectCategories';

import type { DefectCategory } from '../../../types/defectCategory/defectCategory';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import { formatDateTime } from '../../../utils/formats/dateFormat';

import CreateDefectCategoryModal from '../modals/CreateDefectCategoryModal';
import EditDefectCategoryModal from '../modals/EditDefectCategoryModal';
import ViewDefectCategoryModal from '../modals/ViewDefectCategoryModal';

export default function DefectCategoriesTab() {
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
    } = useDefectCategories();

    const [viewItem, setViewItem] = useState<DefectCategory | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DefectCategory | null>(null);
    const [deleteItem, setDeleteItem] = useState<DefectCategory | null>(null);

    const handleView = (item: DefectCategory) => {
        setViewItem(item);

        void loadOne(item.id).then(fresh => {
            if (fresh) {
                setViewItem(current => (current?.id === fresh.id ? fresh : current));
            }
        });
    };

    const columns = useMemo<TableColumnDef<DefectCategory>[]>(() => [
        {
            id: 'name',
            header: 'Категорія',
            accessorFn: row => row.name,
            cell: ({ row }) => (
                <div className="font-medium text-ink">
                    {row.original.name}
                </div>
            ),
        },
        {
            id: 'typicalSymptoms',
            header: 'Типові симптоми',
            accessorFn: row => row.typicalSymptoms,
            cell: ({ row }) => (
                <div className="max-w-xl text-sm text-ink line-clamp-2">
                    {row.original.typicalSymptoms}
                </div>
            ),
        },
        {
            id: 'description',
            header: 'Опис',
            accessorFn: row => row.description,
            cell: ({ row }) => (
                <div className="max-w-xl text-sm text-ink-muted line-clamp-2">
                    {row.original.description}
                </div>
            ),
        },
        {
            id: 'updatedAt',
            header: 'Оновлено',
            accessorFn: row => row.updatedAt ?? row.createdAt,
            cell: ({ row }) => (
                row.original.updatedAt
                    ? formatDateTime(row.original.updatedAt)
                    : <span className="text-ink-muted">Не оновлювалось</span>
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
                storageKey="defect-categories-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою, описом чи симптомами"
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
                        Категорії дефектів ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreateDefectCategoryModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditDefectCategoryModal
                    defectCategory={editingItem}
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
                <ViewDefectCategoryModal
                    defectCategory={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити категорію дефекту?"
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
