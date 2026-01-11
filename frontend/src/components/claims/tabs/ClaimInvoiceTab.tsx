import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, INVOICE_ITEM_LABELS } from '../../../utils/invoiceLabels';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime } from '../../../utils/dateFormat';
import { formatMoney } from '../../../utils/moneyFormat';
import ConfirmBox from '../../../ui/ConfirmBox';
import { useState } from 'react';
import { useInvoice } from '../../../hooks/useInvoice';
import type { InvoiceDetail } from '../../../types/invoice';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import RowActionsMenu from '../../../ui/RowActionsMenu';
import FormField from '../../../ui/FormField';
import { inputBase, primaryButton, secondaryButton } from '../../../ui/formStyles';

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

    const openEditOther = (item: InvoiceDetail) => {
        setEditingItem(item);
        setForm({
            description: item.description,
            quantity: item.quantity,
            unitName: item.unitName,
            pricePerUnit: item.pricePerUnit,
        });
        setOtherModalOpen(true);
    };

    if (loading) return <div>Завантаження рахунку…</div>;

    if (!invoice) {
        if (!canCreateInvoice) {
            return (
                <div className="text-sm text-gray-500 italic">
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
                    <div className="text-sm text-gray-500">До сплати</div>
                    <div className="text-lg font-semibold font-mono">
                        {formatMoney(invoice.totalAmount)}
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-x-6 text-sm text-gray-600">
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
                                    className="text-xs text-blue-600 hover:underline"
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
            <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Тип</th>
                        <th className="p-2 border">Опис</th>
                        <th className="p-2 border text-right">Кількість</th>
                        <th className="p-2 border text-right">Ціна</th>
                        <th className="p-2 border text-right">Сума</th>
                        {hasEditableOtherItems && (
                            <th className="p-2 border w-10">Дії </th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {invoice.items.map((i) => (
                        <tr key={i.id}>
                            <td className="p-2 border">
                                {INVOICE_ITEM_LABELS[i.itemType]}
                            </td>
                            <td className="p-2 border">
                                {i.description}
                            </td>
                            <td className="p-2 border text-right">
                                {i.quantity} {i.unitName}
                            </td>
                            <td className="p-2 border text-right font-mono">
                                {formatMoney(i.pricePerUnit)}
                            </td>
                            <td className="p-2 border text-right font-mono font-semibold">
                                {formatMoney(i.totalPrice)}
                            </td>

                            {/*{hasEditableOtherItems &&*/}
                            {/*    i.itemType === 'OTHER' && (*/}
                            {/*        <td className="p-2 border text-right">*/}
                            {/*            <RowActionsMenu*/}
                            {/*                onEdit={() => openEditOther(i) }*/}
                            {/*                onDelete={() => setDeleteId(i.id) }*/}
                            {/*            />*/}
                            {/*        </td>*/}
                            {/*    )}*/}

                            {hasEditableOtherItems && (
                                i.itemType === 'OTHER' ? (
                                    <td className="p-2 border text-right">
                                        <RowActionsMenu
                                            onEdit={() => openEditOther(i)}
                                            onDelete={() => setDeleteId(i.id)}
                                        />
                                    </td>
                                ) : (
                                    <td className="p-2 border" />
                                )
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

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

                                editingItem
                                    ? await updateOther(editingItem.id, dto)
                                    : await addOther(dto);

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
