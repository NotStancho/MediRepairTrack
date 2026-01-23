import { useState } from 'react';
import type { PaymentMethod } from '../../../types/payment';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '../../../utils/paymentLabels';
import { useInvoice } from '../../../hooks/useInvoice';
import { usePayments } from '../../../hooks/usePayments';

import { formatDateTime } from '../../../utils/dateFormat';
import { formatMoney } from '../../../utils/moneyFormat';

import {inputBase, primaryButton, secondaryButton, selectBase} from "../../../ui/formStyles";
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from "../../../ui/Modal/ModalFooter";
import FormField from "../../../ui/FormField.tsx";

interface Props {
    claimId: number;
}

export default function ClaimPaymentTab({ claimId }: Props) {
    const { invoice, loading, reload } = useInvoice(claimId);
    const { payments, addPayment } = usePayments(invoice?.id);

    const [modalOpen, setModalOpen] = useState(false);

    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<PaymentMethod>('CASH');
    const [provider, setProvider] = useState('');
    const [externalRef, setExternalRef] = useState('');

    if (loading || !invoice) {
        return <div>Завантаження оплати…</div>;
    }

    const remaining = invoice.totalAmount - invoice.totalPaid;

    const canPay = invoice.status === 'ISSUED' || invoice.status === 'PARTIALLY_PAID';

    const numericAmount = Number(amount);
    const isAmountValid = numericAmount > 0 && numericAmount <= remaining;

    const handleCreatePayment = async () => {
        await addPayment({
            amount: numericAmount,
            method,
            provider: method !== 'CASH' ? provider || undefined : undefined,
            externalRef:
                method !== 'CASH' ? externalRef || undefined : undefined,
        });

        await reload();

        setModalOpen(false);
        setAmount('');
        setMethod('CASH');
        setProvider('');
        setExternalRef('');
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 border border-border rounded-lg bg-surface">
                    <div className="text-ink-muted">Сума рахунку</div>
                    <div className="font-semibold font-mono">
                        {formatMoney(invoice.totalAmount)}
                    </div>
                </div>

                <div className="p-3 border border-border rounded-lg bg-surface">
                    <div className="text-ink-muted">Оплачено</div>
                    <div className="font-semibold font-mono">
                        {formatMoney(invoice.totalPaid)}
                    </div>
                </div>

                <div className="p-3 border border-border rounded-lg bg-surface">
                    <div className="text-ink-muted">Залишок</div>
                    <div className="font-semibold font-mono">
                        {formatMoney(remaining)}
                    </div>

                    {invoice.status === 'PAID' && (
                        <span className="mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            Рахунок закрито
                        </span>
                    )}
                </div>
            </div>

            {/* Add payment */}
            {canPay && remaining > 0 && (
                <button
                    onClick={() => setModalOpen(true)}
                    className={primaryButton}
                >
                    + Додати оплату
                </button>
            )}

            {/* Payments table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border rounded-lg">
                    <thead className="bg-surface-muted">
                    <tr>
                        <th className="p-2 border">Створено</th>
                        <th className="p-2 border">Оплачено</th>
                        <th className="p-2 border">Метод</th>
                        <th className="p-2 border">Деталі</th>
                        <th className="p-2 border">Статус</th>
                        <th className="p-2 border text-right">Сума</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map(p => (
                        <tr key={p.id} className="hover:bg-surface-muted">
                            <td className="p-2 border">
                                {formatDateTime(p.createdAt)}
                            </td>

                            <td className="p-2 border">
                                {formatDateTime(p.paidAt)}
                            </td>

                            <td className="p-2 border">
                                {PAYMENT_METHOD_LABELS[p.method]}
                            </td>

                            <td className="p-2 border text-ink-muted text-sm">
                                {p.method !== 'CASH' ? (
                                    <div className="flex flex-col">
                                        {p.provider && (
                                            <span>
                                                Провайдер: {p.provider}
                                            </span>
                                        )}
                                        {p.externalRef && (
                                            <span className="font-mono text-xs">
                                                Ref: {p.externalRef}
                                            </span>
                                        )}
                                        {!p.provider &&
                                            !p.externalRef &&
                                            '–'}
                                    </div>
                                ) : (
                                    '–'
                                )}
                            </td>

                            <td className="p-2 border">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_STATUS_COLORS[p.status]}`}>
                                    {PAYMENT_STATUS_LABELS[p.status]}
                                </span>
                            </td>

                            <td className="p-2 border text-right font-mono font-semibold">
                                {formatMoney(p.amount)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Create payment modal */}
            {modalOpen && (
                <Modal title="Додати оплату" onClose={() => setModalOpen(false)} width="sm">
                    <div className="space-y-4 text-sm">
                        <FormField label="Сума">
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className={inputBase}
                            />
                        </FormField>

                        <FormField label="Метод">
                            <select
                                value={method}
                                onChange={e => setMethod(e.target.value as PaymentMethod) }
                                className={selectBase}
                            >
                                {Object.entries(PAYMENT_METHOD_LABELS).map(
                                    ([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </FormField>

                        {method !== 'CASH' && (
                            <>
                                <FormField label="Провайдер">
                                    <input
                                        value={provider}
                                        onChange={e => setProvider(e.target.value) }
                                        className={inputBase}
                                    />
                                </FormField>

                                <FormField label="Reference">
                                    <input
                                        value={externalRef}
                                        onChange={e => setExternalRef(e.target.value) }
                                        className={`${inputBase} font-mono`}
                                    />
                                </FormField>
                            </>
                        )}

                        <ModalFooter>
                            <button
                                onClick={() => setModalOpen(false)}
                                className={secondaryButton}
                            >
                                Скасувати
                            </button>

                            <button
                                onClick={handleCreatePayment}
                                disabled={!isAmountValid}
                                className={primaryButton}
                            >
                                Зберегти
                            </button>
                        </ModalFooter>
                    </div>
                </Modal>
            )}
        </div>
    );
}
