// pages/employees/tabs/EmployeesListTab.tsx

import { useMemo, useState } from 'react';

import { useEmployees } from '../../../hooks/useEmployees';

import type { Employee, EmployeeFull } from '../../../types/employee/employee';

import Button from '../../../ui/Button';
import ConfirmBox from '../../../ui/ConfirmBox';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import { Table, type TableColumnDef } from '../../../ui/Table';
import TableToolbar from '../../../ui/Table/TableToolbar';

import { formatDateShort } from '../../../utils/formats/dateShortFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import {
    EMPLOYEE_AVAILABILITY_COLORS,
    EMPLOYEE_AVAILABILITY_LABELS,
    EMPLOYEE_POSITION_COLORS,
    EMPLOYEE_POSITION_LABELS,
} from '../../../utils/employeeLabels';

import CreateEmployeeModal from '../modals/CreateEmployeeModal';
import EditEmployeeModal from '../modals/EditEmployeeModal';
import ViewEmployeeModal from '../modals/ViewEmployeeModal';

export default function EmployeesListTab() {
    const {
        data,
        loading,
        loadFull,
        create,
        update,
        remove,
        creating,
        updating,
        deletingId,
    } = useEmployees();

    const [viewItem, setViewItem] = useState<EmployeeFull | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Employee | null>(null);
    const [deleteItem, setDeleteItem] = useState<Employee | null>(null);

    const handleView = (item: Employee) => {
        void loadFull(item.id).then(full => {
            if (full) {
                setViewItem(full);
            }
        });
    };

    const columns = useMemo<TableColumnDef<Employee>[]>(() => [
        {
            id: 'employee',
            header: 'Працівник',
            accessorFn: row =>
                `${row.userLastName} ${row.userFirstName} ${row.userEmail} ${row.specialization}`,
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-ink">
                        {row.original.userLastName} {row.original.userFirstName}
                    </div>
                    <div className="text-xs text-ink-muted">
                        {row.original.userEmail}
                    </div>
                </div>
            ),
        },
        {
            id: 'position',
            header: 'Посада',
            accessorFn: row => EMPLOYEE_POSITION_LABELS[row.position],
            cell: ({ row }) => (
                <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${EMPLOYEE_POSITION_COLORS[row.original.position]}`}
                >
                    {EMPLOYEE_POSITION_LABELS[row.original.position]}
                </span>
            ),
        },
        {
            id: 'specialization',
            header: 'Спеціалізація',
            accessorFn: row => row.specialization,
            cell: ({ row }) => (
                <div className="max-w-xs text-sm text-ink-muted line-clamp-2">
                    {row.original.specialization}
                </div>
            ),
        },
        {
            id: 'availabilityStatus',
            header: 'Статус',
            accessorFn: row =>
                EMPLOYEE_AVAILABILITY_LABELS[row.availabilityStatus],
            cell: ({ row }) => (
                <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${EMPLOYEE_AVAILABILITY_COLORS[row.original.availabilityStatus]}`}
                >
                    {EMPLOYEE_AVAILABILITY_LABELS[row.original.availabilityStatus]}
                </span>
            ),
        },
        {
            id: 'ratePerHour',
            header: 'Ставка',
            accessorFn: row => row.ratePerHour,
            meta: { align: 'right' },
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatMoney(row.original.ratePerHour)} грн/год
                </span>
            ),
        },
        {
            id: 'hireDate',
            header: 'Дата найму',
            accessorFn: row => row.hireDate,
            cell: ({ row }) => (
                <span className="text-sm text-ink-muted">
                    {formatDateShort(row.original.hireDate)}
                </span>
            ),
        },
        {
            id: 'userId',
            header: 'Кабінет',
            accessorFn: row => row.userId,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink-muted">
                    #{row.original.userId}
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
                storageKey="employees-table"
                onRowClick={row => handleView(row.original)}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за ПІБ, email, спеціалізацією чи посадою"
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
                        Працівники ще не додані
                    </div>
                }
            />

            {createOpen && (
                <CreateEmployeeModal
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                    }}
                />
            )}

            {editingItem && (
                <EditEmployeeModal
                    employee={editingItem}
                    updating={updating}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.id, payload);

                        setEditingItem(updated);
                        if (viewItem?.id === updated.id) {
                            const full = await loadFull(updated.id);
                            if (full) {
                                setViewItem(full);
                            }
                        }
                    }}
                />
            )}

            {viewItem && (
                <ViewEmployeeModal
                    employee={viewItem}
                    onClose={() => setViewItem(null)}
                />
            )}

            {deleteItem && (
                <ConfirmBox
                    title="Видалити працівника?"
                    description={`${deleteItem.userLastName} ${deleteItem.userFirstName} • ${deleteItem.userEmail}`}
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
