// pages/directories/modals/ViewRepairWorkModal.tsx

import type { ReactNode } from 'react';

import type { RepairWork } from '../../../types/repairWork/repairWork';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import { formatDateTime } from '../../../utils/formats/dateFormat';

interface Props {
    repairWork: RepairWork;
    complexityName: string;
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

export default function ViewRepairWorkModal({
    repairWork,
    complexityName,
    onClose,
}: Props) {
    return (
        <Modal
            title={`Ремонтна робота: ${repairWork.name}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Назва роботи
                    </div>
                    <div className="mt-2 text-xl font-semibold text-ink">
                        {repairWork.name}
                    </div>
                    <div className="mt-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink-muted">
                        Складність: {complexityName}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {repairWork.description}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створив"
                        value={`#${repairWork.createdByEmployeeId}`}
                        mono
                    />
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(repairWork.createdAt)}
                    />
                </div>

                <InfoCard
                    label="Оновлено"
                    value={
                        repairWork.updatedAt
                            ? formatDateTime(repairWork.updatedAt)
                            : <span className="text-ink-muted">Не оновлювалось</span>
                    }
                />
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
