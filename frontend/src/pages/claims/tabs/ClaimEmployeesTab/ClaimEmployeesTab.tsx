// pages/claims/tabs/ClaimEmployeesTab/ClaimEmployeesTab.tsx

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../../../context/AuthContext';
import { useClaimEmployees } from '../../../../hooks/useClaimEmployees';

import type { ClaimEmployee } from '../../../../types/claimEmployee';

import Button from '../../../../ui/Button';
import ConfirmBox from '../../../../ui/ConfirmBox';
import RowActionsMenu from '../../../../ui/RowActionsMenu';
import { Table, TableToolbar, type TableColumnDef } from '../../../../ui/Table';

import AddClaimEmployeeModal from './modals/AddClaimEmployeeModal';
import EditClaimEmployeeModal from './modals/EditClaimEmployeeModal';

import { EMPLOYEE_POSITION_LABELS } from '../../../../utils/employeeLabels';
import { ROLE_IN_CLAIM_LABELS } from '../../../../utils/roleInClaimLabels';
import EmployeePositionBadge from '../../../../components/badges/EmployeePositionBadge';
import RoleInClaimBadge from '../../../../components/badges/RoleInClaimBadge';

interface Props {
    claimId: number;
}

export default function ClaimEmployeesTab({ claimId }: Props) {
    const { user } = useAuth();
    const {
        data: items,
        loading,
        creating,
        updatingId,
        deletingId,
        create,
        update,
        remove,
    } = useClaimEmployees(claimId);

    const performedByEmployeeId = user?.employeeId ?? null;
    const isManagerOrSystem =
        user?.role === 'ADMIN' ||
        (user?.role === 'EMPLOYEE' && (
            user.position === 'MANAGER' || user.position === 'SYSTEM'
        ));
    const isLeadOnClaim =
        performedByEmployeeId != null &&
        items.some(item => item.employeeId === performedByEmployeeId && item.roleInClaim === 'LEAD');
    const canManageAssignments =
        performedByEmployeeId != null && (isManagerOrSystem || isLeadOnClaim);

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ClaimEmployee | null>(null);
    const [deleteItem, setDeleteItem] = useState<ClaimEmployee | null>(null);

    const columns = useMemo<TableColumnDef<ClaimEmployee>[]>(() => {
        const baseColumns: TableColumnDef<ClaimEmployee>[] = [
            {
                id: 'employee',
                header: 'Працівник',
                accessorFn: row => `${row.lastName} ${row.firstName}`,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.lastName} {row.original.firstName}
                    </span>
                ),
            },
            {
                id: 'position',
                header: 'Посада',
                accessorFn: row => EMPLOYEE_POSITION_LABELS[row.position],
                cell: ({ row }) => <EmployeePositionBadge position={row.original.position} />,
            },
            {
                id: 'roleInClaim',
                header: 'Роль у заявці',
                accessorFn: row => ROLE_IN_CLAIM_LABELS[row.roleInClaim],
                meta: { align: 'center' },
                cell: ({ row }) => <RoleInClaimBadge role={row.original.roleInClaim} />,
            },
            {
                id: 'hoursWorked',
                header: 'Години',
                accessorFn: row =>
                    row.hoursWorked != null ? String(row.hoursWorked) : '',
                meta: { align: 'center' },
                cell: ({ row }) => (
                    <span className="font-mono text-sm text-ink">
                        {row.original.hoursWorked ?? '0'}
                    </span>
                ),
            },
            {
                id: 'notes',
                header: 'Примітки',
                accessorFn: row => row.notes ?? '',
                meta: { cellClassName: 'max-w-xs truncate text-ink-muted' },
                cell: ({ row }) =>
                    row.original.notes ? (
                        <span className="whitespace-pre-line">
                            {row.original.notes}
                        </span>
                    ) : (
                        <span className="text-ink-soft">–</span>
                    ),
            },
        ];

        if (!canManageAssignments) {
            return baseColumns;
        }

        return [
            ...baseColumns,
            {
                id: 'actions',
                header: 'Дії',
                enableSorting: false,
                enableGlobalFilter: false,
                meta: { align: 'center', headerClassName: 'w-20' },
                cell: ({ row }) => {
                    const actions = [
                        {
                            label: 'Редагувати',
                            onClick: () => setEditingItem(row.original),
                        },
                        ...(row.original.employeeId !== performedByEmployeeId ? [{
                            label: 'Видалити',
                            onClick: () => setDeleteItem(row.original),
                            danger: true,
                        }] : []),
                    ];

                    return (
                        <RowActionsMenu
                            disabled={
                                deletingId === row.original.employeeId ||
                                updatingId === row.original.employeeId
                            }
                            actions={actions}
                            trigger={(
                                <span className="rounded px-2 py-1 hover:bg-surface-muted">
                                    ⋯
                                </span>
                            )}
                        />
                    );
                },
            },
        ];
    }, [performedByEmployeeId, canManageAssignments, deletingId, updatingId]);

    return (
        <>
            <Table
                data={items}
                columns={columns}
                loading={loading}
                density="compact"
                storageKey={`claim-employees-tab-${claimId}`}
                showPagination={false}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за ПІБ, посадою, роллю або нотатками"
                        rightSlot={canManageAssignments ? (
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                                disabled={!performedByEmployeeId}
                            >
                                + Додати працівника
                            </Button>
                        ) : undefined}
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Працівники не призначені
                    </div>
                }
            />

            {createOpen && performedByEmployeeId && (
                <AddClaimEmployeeModal
                    claimId={claimId}
                    performedByEmployeeId={performedByEmployeeId}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload);
                        toast.success('Працівника призначено до заявки');
                    }}
                />
            )}

            {editingItem && performedByEmployeeId && (
                <EditClaimEmployeeModal
                    claimEmployee={editingItem}
                    performedByEmployeeId={performedByEmployeeId}
                    saving={updatingId === editingItem.employeeId}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.employeeId, payload);
                        setEditingItem(updated);
                        toast.success('Дані працівника у заявці оновлено');
                    }}
                />
            )}

            {deleteItem && performedByEmployeeId && (
                <ConfirmBox
                    title="Видалити працівника із заявки?"
                    description={`${deleteItem.lastName} ${deleteItem.firstName}`}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.employeeId, performedByEmployeeId);
                        toast.success('Працівника видалено із заявки');
                        setEditingItem(current =>
                            current?.employeeId === deleteItem.employeeId ? null : current,
                        );
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </>
    );
}
