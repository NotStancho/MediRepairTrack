// pages/finance/modals/ViewPaymentModal.tsx

import type { ReactNode } from 'react';

import type { PaymentView } from '../../../types/payment';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import { INVOICE_STATUS_LABELS } from '../../../utils/invoiceLabels';
import { PAYMENT_METHOD_LABELS } from '../../../utils/paymentLabels';
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import InvoiceStatusBadge from '../../../components/badges/InvoiceStatusBadge';
import PaymentStatusBadge from '../../../components/badges/PaymentStatusBadge';

interface Props {
    payment: PaymentView;
    onClose: () => void;
}

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

export default function ViewPaymentModal({ payment, onClose }: Props) {
    return (
        <Modal
            title={`Оплата #${payment.id}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Оплата
                            </div>
                            <div className="mt-2 font-mono text-xl font-semibold text-ink">
                                {formatMoney(payment.amount)}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-ink-muted">
                                <div>Рахунок {payment.invoiceNumber}</div>
                                <div>Заявка #{payment.claimId}</div>
                                <div>Клієнт: {payment.clientOrganizationName}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <PaymentStatusBadge status={payment.status} size="md" />
                            <InvoiceStatusBadge status={payment.invoiceStatus} size="md">
                                Рахунок: {INVOICE_STATUS_LABELS[payment.invoiceStatus]}
                            </InvoiceStatusBadge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard label="Сума оплати" value={formatMoney(payment.amount)} mono />
                    <InfoCard label="Метод" value={PAYMENT_METHOD_LABELS[payment.method]} />
                    <InfoCard label="Сума рахунку" value={formatMoney(payment.invoiceTotalAmount)} mono />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Провайдер"
                        value={payment.provider?.trim() || 'Не вказано'}
                    />
                    <InfoCard
                        label="Reference"
                        value={payment.externalRef?.trim() || 'Не вказано'}
                        mono
                    />
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(payment.createdAt)}
                    />
                    <InfoCard
                        label="Сплачено"
                        value={
                            payment.paidAt
                                ? formatDateTime(payment.paidAt)
                                : <span className="text-ink-muted">Ще не сплачено</span>
                        }
                    />
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
