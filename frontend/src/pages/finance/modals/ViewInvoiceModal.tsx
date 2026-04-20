// pages/finance/modals/ViewInvoiceModal.tsx

import { useMemo, type ReactNode } from 'react';

import type { InvoiceDetail, InvoiceFull } from '../../../types/invoice';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { Table, type TableColumnDef } from '../../../ui/Table';

import {
    INVOICE_ITEM_LABELS,
    INVOICE_STATUS_COLORS,
    INVOICE_STATUS_LABELS,
} from '../../../utils/invoiceLabels';
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';

interface Props {
    invoice: InvoiceFull;
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

export default function ViewInvoiceModal({ invoice, onClose }: Props) {
    const remaining = invoice.totalAmount - invoice.totalPaid;

    const itemColumns = useMemo<TableColumnDef<InvoiceDetail>[]>(() => [
        {
            id: 'itemType',
            header: 'Тип',
            accessorFn: row => INVOICE_ITEM_LABELS[row.itemType],
            cell: ({ row }) => INVOICE_ITEM_LABELS[row.original.itemType],
        },
        {
            id: 'description',
            header: 'Опис',
            accessorFn: row => row.description,
            cell: ({ row }) => (
                <div className="max-w-xs text-sm text-ink">
                    {row.original.description}
                </div>
            ),
        },
        {
            id: 'quantity',
            header: 'Кількість',
            accessorFn: row => `${row.quantity} ${row.unitName}`,
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {row.original.quantity} {row.original.unitName}
                </span>
            ),
        },
        {
            id: 'pricePerUnit',
            header: 'Ціна',
            accessorFn: row => String(row.pricePerUnit),
            cell: ({ row }) => (
                <span className="font-mono text-sm text-ink">
                    {formatMoney(row.original.pricePerUnit)}
                </span>
            ),
        },
        {
            id: 'totalPrice',
            header: 'Сума',
            accessorFn: row => String(row.totalPrice),
            cell: ({ row }) => (
                <span className="font-mono font-semibold text-ink">
                    {formatMoney(row.original.totalPrice)}
                </span>
            ),
        },
    ], []);

    return (
        <Modal
            title={`Рахунок ${invoice.invoiceNumber}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Рахунок
                            </div>
                            <div className="mt-2 text-xl font-semibold text-ink">
                                {invoice.invoiceNumber}
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-ink-muted">
                                <div>Заявка #{invoice.claimId}</div>
                                <div>Клієнт: {invoice.clientOrganizationName}</div>
                            </div>
                        </div>

                        <span className={`inline-flex rounded-full px-3 py-1 text-sm ${INVOICE_STATUS_COLORS[invoice.status]}`}>
                            {INVOICE_STATUS_LABELS[invoice.status]}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard label="Всього" value={formatMoney(invoice.totalAmount)} mono />
                    <InfoCard label="Оплачено" value={formatMoney(invoice.totalPaid)} mono />
                    <InfoCard label="Залишок" value={formatMoney(remaining)} mono />
                </div>

                {(invoice.totalBeforeDiscount != null || invoice.discountAmount != null) && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoCard
                            label="До знижки"
                            value={formatMoney(invoice.totalBeforeDiscount)}
                            mono
                        />
                        <InfoCard
                            label="Знижка"
                            value={formatMoney(invoice.discountAmount)}
                            mono
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(invoice.createdAt)}
                    />
                    <InfoCard
                        label="Виставлено"
                        value={
                            invoice.issuedAt
                                ? formatDateTime(invoice.issuedAt)
                                : <span className="text-ink-muted">Ще не виставлено</span>
                        }
                    />
                    <InfoCard
                        label="Оплатити до"
                        value={
                            invoice.dueAt
                                ? formatDateTime(invoice.dueAt)
                                : <span className="text-ink-muted">Не встановлено</span>
                        }
                    />
                    <InfoCard
                        label="Закрито"
                        value={
                            invoice.closedAt
                                ? formatDateTime(invoice.closedAt)
                                : <span className="text-ink-muted">Ще не закрито</span>
                        }
                    />
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-medium text-ink">
                        Позиції рахунку
                    </div>

                    <Table
                        data={invoice.items}
                        columns={itemColumns}
                        loading={false}
                        density="compact"
                        striped
                        storageKey="invoice-detail-items-table"
                        showPagination={false}
                        renderEmptyState={
                            <div className="text-sm text-ink-muted">
                                Позиції рахунку відсутні
                            </div>
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
