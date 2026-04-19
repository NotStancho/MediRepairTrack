// pages/clients/modals/ViewClientContractModal.tsx

import type { ReactNode } from 'react';

import type { ClientContract } from '../../../types/clientContract/clientContract';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import {
    CONTRACT_STATUS_COLORS,
    CONTRACT_TYPE_COLORS,
    getContractStatusLabel,
    getContractTypeLabel,
} from '../../../utils/clientContractLabel';
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';
import { formatPercent } from '../../../utils/formats/percentFormat';

interface Props {
    contract: ClientContract;
    clientName: string;
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

export default function ViewClientContractModal({
    contract,
    clientName,
    onClose,
}: Props) {
    return (
        <Modal
            title={`Контракт: ${contract.contractName}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Назва договору
                            </div>
                            <div className="mt-2 text-xl font-semibold text-ink">
                                {contract.contractName}
                            </div>
                            <div className="mt-2 text-sm text-ink-muted">
                                Клієнт: {clientName}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm ${CONTRACT_TYPE_COLORS[contract.contractType]}`}>
                                {getContractTypeLabel(contract.contractType)}
                            </span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm ${CONTRACT_STATUS_COLORS[contract.status]}`}>
                                {getContractStatusLabel(contract.status)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Діє з"
                        value={formatDateShort(contract.validFrom)}
                    />
                    <InfoCard
                        label="Діє до"
                        value={formatDateShort(contract.validTo)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard label="Знижка на роботи" value={formatPercent(contract.discountLabor)} mono />
                    <InfoCard label="Знижка на запчастини" value={formatPercent(contract.discountParts)} mono />
                    <InfoCard label="Знижка на доставку" value={formatPercent(contract.discountDelivery)} mono />
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Нотатки
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {contract.notes?.trim() || 'Нотатки відсутні'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(contract.createdAt)}
                    />
                    <InfoCard
                        label="Оновлено"
                        value={
                            contract.updatedAt
                                ? formatDateTime(contract.updatedAt)
                                : <span className="text-ink-muted">Не оновлювалось</span>
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
