// pages/claims/tabs/ClaimInvoiceTab/ClaimInvoiceTab.tsx

import { useAuth } from '../../../../context/AuthContext';
import { useMemo, useState, useCallback } from 'react';
import { useInvoice } from '../../../../hooks/useInvoice';
import type { InvoiceDetail } from '../../../../types/invoice';

import Button from '../../../../ui/Button';
import RowActionsMenu from '../../../../ui/RowActionsMenu';
import ConfirmBox from '../../../../ui/ConfirmBox';
import { Table, TableToolbar, type TableColumnDef } from '../../../../ui/Table';

import { formatDateTime } from '../../../../utils/formats/dateFormat';
import { formatMoney } from '../../../../utils/formats/moneyFormat';
import { INVOICE_ITEM_LABELS } from '../../../../utils/invoiceLabels';

import InvoiceStatusBadge from '../../../../components/badges/InvoiceStatusBadge';
import InvoiceOtherItemModal from './modals/InvoiceOtherItemModal';
import InvoiceDueDateModal from './modals/InvoiceDueDateModal';

interface Props {
    claimId: number;
}

export default function ClaimInvoiceTab({ claimId }: Props) {
    const { user } = useAuth();

    const isEmployee = user?.role === 'EMPLOYEE';
    const isManager = isEmployee && user.position === 'MANAGER';
    const isEngineer = isEmployee && user.position === 'SERVICE_ENGINEER';

    const { invoice, loading, createDraft, recalc, issue, updateDueDate, addOther, updateOther, removeOther } = useInvoice(claimId);

    const canEditInvoice = invoice?.status === 'DRAFT';
    const canCreateInvoice = isManager;
    const canManageInvoice = isManager && canEditInvoice;

    const canEditOtherItems = (isManager || isEngineer) && canEditInvoice;
    const hasEditableOtherItems = canEditOtherItems && invoice.items.some(i => i.itemType === 'OTHER');

    const canUpdateDueDate = isManager && invoice && !['PAID', 'CANCELED'].includes(invoice.status);

    const [confirmIssueOpen, setConfirmIssueOpen] = useState(false);
    const [otherModalOpen, setOtherModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InvoiceDetail | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [dueDateModalOpen, setDueDateModalOpen] = useState(false);

    const openAddOther = () => {
        setEditingItem(null);
        setOtherModalOpen(true);
    };

    const openEditOther = useCallback((item: InvoiceDetail) => {
        setEditingItem(item);
        setOtherModalOpen(true);
    }, []);

    const itemColumns = useMemo<TableColumnDef<InvoiceDetail>[]>(() => {
        const cols: TableColumnDef<InvoiceDetail>[] = [
            {
                id: 'itemType',
                header: 'Тип',
                accessorFn: row => INVOICE_ITEM_LABELS[row.itemType],
                cell: ({ row }) => INVOICE_ITEM_LABELS[row.original.itemType],
            },
            {
                id: 'description',
                header: 'Опис',
                accessorFn: row => row.description ?? '',
                cell: ({ row }) => row.original.description,
            },
            {
                id: 'quantity',
                header: 'Кількість',
                accessorFn: row =>
                    `${row.quantity} ${row.unitName}`,
                meta: { align: 'right' },
                cell: ({ row }) => (
                    <span className="font-mono">
                    {row.original.quantity} {row.original.unitName}
                </span>
                ),
            },
            {
                id: 'price',
                header: 'Ціна',
                accessorFn: row => String(row.pricePerUnit),
                meta: { align: 'right' },
                cell: ({ row }) => (
                    <span className="font-mono">
                    {formatMoney(row.original.pricePerUnit)}
                </span>
                ),
            },
            {
                id: 'sum',
                header: 'Сума',
                accessorFn: row => String(row.totalPrice),
                meta: { align: 'right' },
                cell: ({ row }) => (
                    <span className="font-mono font-semibold">
                    {formatMoney(row.original.totalPrice)}
                </span>
                ),
            },
        ];

        if (hasEditableOtherItems) {
            cols.push({
                id: 'actions',
                header: 'Дії',
                meta: { align: 'center', headerClassName: 'w-10' },
                enableSorting: false,
                enableGlobalFilter: false,
                cell: ({ row }) =>
                    row.original.itemType === 'OTHER' ? (
                        <RowActionsMenu
                            actions={[
                                {
                                    label: 'Редагувати',
                                    onClick: () => openEditOther(row.original),
                                },
                                {
                                    label: 'Видалити',
                                    onClick: () => setDeleteId(row.original.id),
                                    danger: true,
                                },
                            ]}
                            trigger={
                                <span
                                    className="
                                        px-2 py-1 rounded
                                        text-ink-muted
                                        hover:bg-surface-muted
                                        hover:text-ink
                                    "
                                >
                                    ...
                                </span>
                            }
                        />
                    ) : null,
            });
        }

        return cols;
    }, [hasEditableOtherItems, openEditOther]);

    if (loading) return <div>Завантаження рахунку…</div>;

    if (!invoice) {
        if (!canCreateInvoice) {
            return (
                <div className="text-sm text-ink-muted italic">
                    Рахунок ще не створено
                </div>
            );
        }

        return (
            <Button
                variant="primary"
                onClick={async () => {
                    await createDraft();
                }}
            >
                Створити рахунок
            </Button>
        );
    }

    const showTotals = invoice.status !== 'DRAFT';

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="font-medium">
                        Рахунок {invoice.invoiceNumber}
                    </div>
                    <InvoiceStatusBadge status={invoice.status} />
                </div>

                <div className="text-right">
                    <div className="text-sm text-ink-muted">До сплати</div>
                    <div className="text-lg font-semibold font-mono">
                        {formatMoney(invoice.totalAmount)}
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-x-6 text-sm text-ink-muted">
                {/* LEFT */}
                <div className="space-y-1">
                    <div>Створено: {formatDateTime(invoice.createdAt)}</div>
                    {invoice.dueAt && (<div className="flex items-center gap-2">
                            <span className={invoice.status === 'OVERDUE' ? 'text-red-700 font-medium' : 'text-orange-700'}>
                                Оплатити до: {formatDateTime(invoice.dueAt)}
                            </span>

                            {canUpdateDueDate && (
                                <Button
                                    variant="default"
                                    onClick={() => setDueDateModalOpen(true)}
                                    className="h-auto px-0 bg-transparent text-xs text-brand shadow-none hover:bg-transparent hover:underline"
                                >
                                    Продовжити
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <div className="space-y-1 text-right">
                    {invoice.issuedAt && (
                        <div>Виставлено: {formatDateTime(invoice.issuedAt)}</div>
                    )}

                    {invoice.closedAt && (
                        <div>Закрито: {formatDateTime(invoice.closedAt)}</div>
                    )}
                </div>
            </div>


            {/* Actions */}
            {canEditInvoice && (
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        {canManageInvoice && (
                            <>
                                <Button variant="secondary" onClick={recalc}>
                                    Перерахувати
                                </Button>

                                <Button variant="primary" onClick={() => setConfirmIssueOpen(true)}>
                                    Виставити рахунок
                                </Button>
                            </>
                        )}
                    </div>

                    {canEditOtherItems && (
                        <Button variant="secondary" onClick={openAddOther}>
                            + Додати інше
                        </Button>
                    )}
                </div>
            )}

            {/* Items */}
            <Table
                data={invoice.items}
                columns={itemColumns}
                loading={loading}
                density="compact"
                storageKey="claim-invoice-tab"
                showPagination={false}
                renderToolbar={(table) => (
                    <TableToolbar
                        table={table}
                        globalFilterPlaceholder="Пошук за типом або описом"
                    />
                )}
                renderEmptyState={
                    <div className="text-sm text-ink-muted">
                        Немає позицій
                    </div>
                }
            />

            {/* Totals */}
            <div className="flex justify-end text-sm">
                <div className="space-y-1">
                    {showTotals && (
                        <>
                            <div>
                                До знижки: {formatMoney(invoice.totalBeforeDiscount!)}
                            </div>
                            <div>
                                Знижка: {formatMoney(invoice.discountAmount!)}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {otherModalOpen && (
                <InvoiceOtherItemModal
                    item={editingItem}
                    onClose={() => setOtherModalOpen(false)}
                    onSave={async (payload) => {
                        if (editingItem) {
                            await updateOther(editingItem.id, payload);
                        } else {
                            await addOther(payload);
                        }
                    }}
                />
            )}

            {dueDateModalOpen && (
                <InvoiceDueDateModal
                    dueAt={invoice.dueAt}
                    onClose={() => setDueDateModalOpen(false)}
                    onSave={updateDueDate}
                />
            )}

            {/* CONFIRM DELETE */}
            {deleteId && (
                <ConfirmBox
                    title="Видалити позицію?"
                    description="Цю дію неможливо скасувати."
                    confirmText="Так, видалити"
                    confirmVariant="danger"
                    onConfirm={async () => {
                        await removeOther(deleteId);
                        setDeleteId(null);
                    }}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            {/* CONFIRM ISSUE */}
            {confirmIssueOpen && (
                <ConfirmBox
                    title="Виставити рахунок?"
                    description="Після виставлення рахунок буде зафіксований."
                    confirmText="Так, виставити"
                    onConfirm={async () => {
                        await issue();
                        setConfirmIssueOpen(false);
                    }}
                    onCancel={() => setConfirmIssueOpen(false)}
                />
            )}
        </div>
    );
}
