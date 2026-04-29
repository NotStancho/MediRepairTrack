// pages/directories/tabs/RepairWorksTab.tsx

import { useMemo, useState } from 'react';

import { useAuth } from '../../../context/AuthContext';
import { useRepairWorks } from '../../../hooks/useRepairWorks';
import { useComplexityLevels } from '../../../hooks/diagnosis/useComplexityLevels';

import type { RepairWork } from '../../../types/repairWork/repairWork';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import { formatDateTime } from '../../../utils/formats/dateFormat';

import CreateRepairWorkModal from '../modals/CreateRepairWorkModal';
import EditRepairWorkModal from '../modals/EditRepairWorkModal';
import ViewRepairWorkModal from '../modals/ViewRepairWorkModal';

export default function RepairWorksTab() {
    const { user } = useAuth();
    const employeeId = user?.employeeId ?? null;

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
    } = useRepairWorks();

    const {
        data: complexityLevels,
        loading: complexityLoading,
    } = useComplexityLevels();

    const [viewItem, setViewItem] = useState<RepairWork | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RepairWork | null>(null);
    const [deleteItem, setDeleteItem] = useState<RepairWork | null>(null);

    const complexityNames = useMemo(
        () =>
            new Map(
                complexityLevels.map(level => [level.id, level.name])
            ),
        [complexityLevels]
    );

    const handleView = (item: RepairWork) => {
        setViewItem(item);

        void loadOne(item.id).then(fresh => {
            if (fresh) {
                setViewItem(current => (current?.id === fresh.id ? fresh : current));
            }
        });
    };

    const columns = useMemo<TableColumnDef<RepairWork>[]>(() => [
        {
            id: 'name',
            header: 'Робота',
            accessorFn: row => row.name,
            cell: ({ row }) => (
                <div className="font-medium text-ink">
                    {row.original.name}
                </div>
            ),
        },
        {
            id: 'complexityLevel',
            header: 'Складність',
            accessorFn: row =>
                complexityNames.get(row.complexityLevelId) ?? String(row.complexityLevelId),
            cell: ({ row }) => (
                <span className="inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-strong">
                    {complexityNames.get(row.original.complexityLevelId) ??
                        `Рівень #${row.original.complexityLevelId}`}
                </span>
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
            id: 'createdBy',
            header: 'ID автора',
            accessorFn: row => row.createdByEmployeeId,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink-muted">
                    #{row.original.createdByEmployeeId}
                </span>
            ),
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
    ], [complexityNames, deletingId]);

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                loading={loading || complexityLoading}
                density="compact"
                striped
                storageKey="repair-works-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за назвою, складністю чи описом"
                        rightSlot={
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                                disabled={!employeeId}
                                title={
                                    employeeId
                                        ? 'Додати ремонтну роботу'
                                        : 'Створення недоступне без employeeId'
                                }
                            >
                                + Додати
                            </Button>
                        }
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Ремонтні роботи ще не додані
                    </div>
                }
            />

            {createOpen && employeeId && (
                <CreateRepairWorkModal
                    complexityLevels={complexityLevels}
                    complexityLoading={complexityLoading}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload, employeeId);
                    }}
                />
            )}

            {editingItem && (
                <EditRepairWorkModal
                    repairWork={editingItem}
                    complexityLevels={complexityLevels}
                    complexityLoading={complexityLoading}
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
                <ViewRepairWorkModal
                    repairWork={viewItem}
                    complexityName={
                        complexityNames.get(viewItem.complexityLevelId) ??
                        `Рівень #${viewItem.complexityLevelId}`
                    }
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити ремонтну роботу?"
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
