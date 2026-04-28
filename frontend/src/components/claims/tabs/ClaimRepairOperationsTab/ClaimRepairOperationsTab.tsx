// components/tabs/ClaimRepairOperationsTab/ClaimRepairOperationsTab

import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../../../context/AuthContext';
import { useClaimEmployees } from '../../../../hooks/useClaimEmployees';
import { useClaimRepairOperations } from '../../../../hooks/useClaimRepairOperations';
import { useRepairOperations } from '../../../../hooks/useRepairOperations';

import type { ClaimEmployee } from '../../../../types/claimEmployee';
import type { ClaimRepairOperation } from '../../../../types/claim/claimRepairOperation';

import Button from '../../../../ui/Button';
import ConfirmBox from '../../../../ui/ConfirmBox';
import RowActionsMenu, { type RowAction } from '../../../../ui/RowActionsMenu';
import { Table, TableToolbar, type TableColumnDef } from '../../../../ui/Table';

import CreateClaimRepairOperationModal from './modals/CreateClaimRepairOperationModal';
import EditClaimRepairOperationModal from './modals/EditClaimRepairOperationModal';

import { formatDateTime } from '../../../../utils/formats/dateFormat';
import { formatHours } from '../../../../utils/formats/hourFormat';
import {
    EMPLOYEE_POSITION_LABELS,
} from '../../../../utils/employeeLabels';
import {
    ROLE_IN_CLAIM_COLORS,
    ROLE_IN_CLAIM_LABELS,
} from '../../../../utils/roleInClaimLabels';

interface Props {
    claimId: number;
    onOperationsChanged?: () => Promise<void> | void;
}

function getEmployeeDisplayName(employee?: ClaimEmployee) {
    return employee
        ? `${employee.lastName} ${employee.firstName}`
        : null;
}

export default function ClaimRepairOperationsTab({
    claimId,
    onOperationsChanged,
}: Props) {
    const { user } = useAuth();

    const {
        data: items,
        loading,
        creating,
        updatingId,
        deletingId,
        create,
        update,
        updateNote,
        remove,
    } = useClaimRepairOperations(claimId);

    const {
        data: claimEmployees,
        loading: claimEmployeesLoading,
    } = useClaimEmployees(claimId);

    const {
        data: repairOperations,
        loading: repairOperationsLoading,
    } = useRepairOperations();

    const [createOpen, setCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ClaimRepairOperation | null>(null);
    const [editingNoteOnly, setEditingNoteOnly] = useState(false);
    const [deleteItem, setDeleteItem] = useState<ClaimRepairOperation | null>(null);

    const performedByEmployeeId = user?.employeeId ?? null;
    const isManager = user?.role === 'EMPLOYEE' && user.position === 'MANAGER';

    const employeeById = useMemo(
        () => new Map(claimEmployees.map(employee => [employee.employeeId, employee])),
        [claimEmployees],
    );
    const repairOperationById = useMemo(
        () => new Map(repairOperations.map(operation => [operation.id, operation])),
        [repairOperations],
    );

    const currentClaimEmployee = performedByEmployeeId != null
        ? employeeById.get(performedByEmployeeId)
        : undefined;
    const isAssignedEmployee = !!currentClaimEmployee;
    const isLeadOnClaim = currentClaimEmployee?.roleInClaim === 'LEAD';
    const canActOnWork =
        user?.role === 'EMPLOYEE' &&
        performedByEmployeeId != null &&
        !isManager &&
        isAssignedEmployee;
    const canCreateOwnWork = canActOnWork;
    const showActionsColumn = canActOnWork;

    const syncClaimSummary = async () => {
        await onOperationsChanged?.();
    };

    const openEdit = useCallback((item: ClaimRepairOperation, noteOnly: boolean) => {
        setEditingItem(item);
        setEditingNoteOnly(noteOnly);
    }, []);

    const closeEdit = useCallback(() => {
        setEditingItem(null);
        setEditingNoteOnly(false);
    }, []);

    const getRowActions = useCallback((item: ClaimRepairOperation) => {
        const isOwnRecord = performedByEmployeeId != null && item.employeeId === performedByEmployeeId;
        const actions: RowAction[] = [];

        if (canActOnWork && isOwnRecord) {
            actions.push({
                label: 'Редагувати',
                onClick: () => openEdit(item, false),
            });
        } else if (canActOnWork && isLeadOnClaim) {
            actions.push({
                label: 'Редагувати примітку',
                onClick: () => openEdit(item, true),
            });
        }

        if (canActOnWork && isOwnRecord) {
            actions.push({
                label: 'Видалити',
                onClick: () => setDeleteItem(item),
                danger: true,
            });
        }

        return actions;
    }, [
        canActOnWork,
        isLeadOnClaim,
        openEdit,
        performedByEmployeeId
    ]);

    const columns = useMemo<TableColumnDef<ClaimRepairOperation>[]>(() => {
        const baseColumns: TableColumnDef<ClaimRepairOperation>[] = [
            {
                id: 'operation',
                header: 'Робота',
                accessorFn: row => {
                    const operation = repairOperationById.get(row.operationId);

                    return [
                        operation?.name ?? `Робота #${row.operationId}`,
                        operation?.description ?? '',
                    ].join(' ');
                },
                cell: ({ row }) => {
                    const operation = repairOperationById.get(row.original.operationId);
                    const note = row.original.note?.trim() ?? '';
                    const notePreview = note.length > 100
                        ? note.slice(0, 100) + '…'
                        : note;

                    return (
                        <div className="min-w-0 space-y-1">
                            <div className="font-medium text-ink">
                                {operation?.name ?? `Робота #${row.original.operationId}`}
                            </div>

                            {note && (
                                <div
                                    className="line-clamp-2 whitespace-pre-line wrap-break-word text-xs text-ink-muted"
                                    title={note}
                                >
                                    Примітка: {notePreview}
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'employee',
                header: 'Виконавець',
                accessorFn: row => {
                    const employee = employeeById.get(row.employeeId);

                    return [
                        getEmployeeDisplayName(employee) ?? `Працівник #${row.employeeId}`,
                        employee ? EMPLOYEE_POSITION_LABELS[employee.position] : '',
                        employee ? ROLE_IN_CLAIM_LABELS[employee.roleInClaim] : '',
                    ].join(' ');
                },
                cell: ({ row }) => {
                    const employee = employeeById.get(row.original.employeeId);

                    if (!employee) {
                        return (
                            <div className="min-w-0">
                                <div className="font-medium text-ink">
                                    Працівник #{row.original.employeeId}
                                </div>
                                <div className="text-xs text-ink-muted">
                                    Немає у поточному списку працівників заявки
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div className="min-w-0">
                            <div className="font-medium text-ink">
                                {employee.lastName} {employee.firstName}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-1 text-xs">
                                <span
                                    className={`inline-flex rounded-full px-2 py-0.5 ${ROLE_IN_CLAIM_COLORS[employee.roleInClaim]}`}
                                >
                                    {ROLE_IN_CLAIM_LABELS[employee.roleInClaim]}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'timeSpent',
                header: 'Час',
                accessorFn: row => row.timeSpent,
                meta: { align: 'right' },
                cell: ({ row }) => (
                    <span className="font-mono font-medium">
                        {formatHours(row.original.timeSpent, '0 год')}
                    </span>
                ),
            },
            {
                id: 'date',
                header: 'Дата',
                accessorFn: row => row.createdAt,
                cell: ({ row }) => (
                    <div className="space-y-1 text-xs text-ink-muted">
                        <div>
                            Додано:{' '}
                            <span className="text-ink">
                                {formatDateTime(row.original.createdAt)}
                            </span>
                        </div>

                        {row.original.updatedAt && (
                            <div>
                                Оновлено:{' '}
                                <span className="text-ink">
                                    {formatDateTime(row.original.updatedAt)}
                                </span>
                            </div>
                        )}
                    </div>
                ),
            },
        ];

        if (!showActionsColumn) {
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
                    const actions = getRowActions(row.original);

                    if (!actions.length) {
                        return null;
                    }

                    return (
                        <RowActionsMenu
                            disabled={
                                deletingId === row.original.id ||
                                updatingId === row.original.id
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
    }, [
        deletingId,
        employeeById,
        getRowActions,
        repairOperationById,
        showActionsColumn,
        updatingId,
    ]);

    const deleteOperationName = deleteItem
        ? repairOperationById.get(deleteItem.operationId)?.name ?? `Робота #${deleteItem.operationId}`
        : null;

    return (
        <>
            <Table
                data={items}
                columns={columns}
                loading={loading || claimEmployeesLoading || repairOperationsLoading}
                density="compact"
                storageKey={`claim-repair-operations-tab-${claimId}`}
                showPagination={false}
                renderToolbar={table => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за роботою, виконавцем або приміткою"
                        rightSlot={canCreateOwnWork && currentClaimEmployee ? (
                            <Button
                                variant="primary"
                                onClick={() => setCreateOpen(true)}
                            >
                                + Додати роботу
                            </Button>
                        ) : undefined}
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Ремонтні роботи ще не зафіксовані
                    </div>
                }
            />

            {createOpen && currentClaimEmployee && performedByEmployeeId && (
                <CreateClaimRepairOperationModal
                    claimId={claimId}
                    currentEmployee={currentClaimEmployee}
                    repairOperations={repairOperations}
                    repairOperationsLoading={repairOperationsLoading}
                    creating={creating}
                    onClose={() => setCreateOpen(false)}
                    onCreate={async payload => {
                        await create(payload, performedByEmployeeId);
                        await syncClaimSummary();
                        toast.success('Ремонтну роботу додано');
                    }}
                />
            )}

            {editingItem && performedByEmployeeId && (
                <EditClaimRepairOperationModal
                    claimRepairOperation={editingItem}
                    repairOperations={repairOperations}
                    repairOperationsLoading={repairOperationsLoading}
                    updating={updatingId === editingItem.id}
                    noteOnly={editingNoteOnly}
                    onClose={closeEdit}
                    onSave={async payload => {
                        const normalizeNote = (value?: string | null) => value?.trim() || null;

                        const operationChanged = payload.operationId !== editingItem.operationId;
                        const timeChanged = Number(payload.timeSpent) !== Number(editingItem.timeSpent);
                        const noteChanged =
                            normalizeNote(payload.note) !== normalizeNote(editingItem.note);

                        const isNoteOnlyUpdate =
                            editingNoteOnly || (!operationChanged && !timeChanged && noteChanged);

                        if (!operationChanged && !timeChanged && !noteChanged) {
                            // нічого не змінилось
                            closeEdit();
                            return;
                        }

                        if (isNoteOnlyUpdate) {
                            await updateNote(
                                editingItem.id,
                                { note: normalizeNote(payload.note) },
                                performedByEmployeeId
                            );
                        } else {
                            await update(editingItem.id, payload, performedByEmployeeId);
                        }

                        await syncClaimSummary();

                        toast.success(
                            isNoteOnlyUpdate
                                ? 'Примітку оновлено'
                                : 'Ремонтну роботу оновлено'
                        );
                    }}
                />
            )}

            {deleteItem && performedByEmployeeId && (
                <ConfirmBox
                    title="Видалити ремонтну роботу?"
                    description={deleteOperationName ?? 'Обраний запис буде видалено'}
                    confirmText="Видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await remove(deleteItem.id, performedByEmployeeId);
                        await syncClaimSummary();
                        toast.success('Ремонтну роботу видалено');
                        setDeleteItem(null);
                    }}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
        </>
    );
}
