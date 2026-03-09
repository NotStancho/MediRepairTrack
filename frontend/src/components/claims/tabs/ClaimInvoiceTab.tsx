import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, INVOICE_ITEM_LABELS } from '../../../utils/invoiceLabels';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime } from '../../../utils/dateFormat';
import { formatMoney } from '../../../utils/moneyFormat';
import ConfirmBox from '../../../ui/ConfirmBox';
import { useMemo, useState, useCallback } from 'react';
import { useInvoice } from '../../../hooks/useInvoice';
import type { InvoiceDetail } from '../../../types/invoice';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import FormField from '../../../ui/FormField';
import { inputBase, primaryButton, secondaryButton } from '../../../ui/formStyles';
import { Table, TableToolbar, type TableColumnDef } from '../../../ui/Table';

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
    const [newDueAt, setNewDueAt] = useState('');

    const [form, setForm] = useState<{
        description: string;
        quantity: number;
        unitName: string;
        pricePerUnit: number | '';
    }>({
        description: '',
        quantity: 1,
        unitName: 'послуга',
        pricePerUnit: '',
    });

    const openAddOther = () => {
        setEditingItem(null);
        setForm({
            description: '',
            quantity: 1,
            unitName: 'послуга',
            pricePerUnit: '',
        });
        setOtherModalOpen(true);
    };

    const openEditOther = useCallback((item: InvoiceDetail) => {
        setEditingItem(item);
        setForm({
            description: item.description,
            quantity: item.quantity,
            unitName: item.unitName,
            pricePerUnit: item.pricePerUnit,
        });
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
                            onEdit={() => openEditOther(row.original)}
                            onDelete={() => setDeleteId(row.original.id)}
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
            <button
                onClick={async () => {
                    await createDraft();
                }}
                className={primaryButton}
            >
                Створити рахунок
            </button>
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
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${INVOICE_STATUS_COLORS[invoice.status]}`}>
                        {INVOICE_STATUS_LABELS[invoice.status]}
                    </div>
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
                                <button
                                    onClick={() => {
                                        setNewDueAt(invoice.dueAt ?? '');
                                        setDueDateModalOpen(true);
                                    }}
                                    className="text-xs text-brand hover:underline"
                                >
                                    Продовжити
                                </button>
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
                                <button onClick={recalc} className={secondaryButton}>
                                    Перерахувати
                                </button>

                                <button onClick={() => setConfirmIssueOpen(true)} className={primaryButton}>
                                    Виставити рахунок
                                </button>
                            </>
                        )}
                    </div>

                    {canEditOtherItems && (
                        <button onClick={openAddOther} className={secondaryButton}>
                            + Додати інше
                        </button>
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

            {/* OTHER MODAL */}
            {otherModalOpen && (
                <Modal
                    title={
                        editingItem
                            ? 'Редагувати позицію'
                            : 'Додати позицію'
                    }
                    onClose={() => setOtherModalOpen(false)}
                    width="md"
                    backdrop="dim"
                >
                    <FormField label="Опис">
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className={inputBase}
                        />
                    </FormField>

                    <div className="grid grid-cols-3 gap-2">
                        <FormField label="Кількість">
                            <input
                                type="number"
                                value={form.quantity}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        quantity: +e.target.value,
                                    })
                                }
                                className={inputBase}
                            />
                        </FormField>

                        <FormField label="Одиниця">
                            <input
                                value={form.unitName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        unitName: e.target.value,
                                    })
                                }
                                className={inputBase}
                            />
                        </FormField>

                        <FormField label="Ціна">
                            <input
                                type="number"
                                value={form.pricePerUnit}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pricePerUnit:
                                            e.target.value === ''
                                                ? ''
                                                : +e.target.value,
                                    })
                                }
                                className={inputBase}
                            />
                        </FormField>
                    </div>

                    <ModalFooter>
                        <button
                            onClick={() =>
                                setOtherModalOpen(false)
                            }
                            className={secondaryButton}
                        >
                            Скасувати
                        </button>

                        <button
                            onClick={async () => {
                                const dto = { ...form,
                                    pricePerUnit: Number(form.pricePerUnit),
                                };

                                if (editingItem) {
                                    await updateOther(editingItem.id, dto);
                                } else {
                                    await addOther(dto);
                                }

                                setOtherModalOpen(false);
                            }}
                            className={primaryButton}
                        >
                            {editingItem ? 'Зберегти' : 'Додати'}
                        </button>
                    </ModalFooter>
                </Modal>
            )}

            {/* DUE DATE MODAL */}
            {dueDateModalOpen && (
                <Modal
                    title="Продовжити термін оплати"
                    onClose={() => setDueDateModalOpen(false)}
                    width="sm"
                >
                    <FormField label="Новий термін оплати">
                        <input
                            type="datetime-local"
                            value={newDueAt.slice(0, 16)}
                            onChange={(e) =>
                                setNewDueAt(e.target.value)
                            }
                            className={inputBase}
                        />
                    </FormField>

                    <ModalFooter>
                        <button
                            onClick={() => setDueDateModalOpen(false) }
                            className={secondaryButton}
                        >
                            Скасувати
                        </button>

                        <button
                            onClick={async () => {
                                await updateDueDate(new Date(newDueAt).toISOString());
                                setDueDateModalOpen(false);
                            }}
                            className={primaryButton}
                        >
                            Зберегти
                        </button>
                    </ModalFooter>
                </Modal>
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
