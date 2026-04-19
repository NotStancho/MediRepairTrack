import type { ReactNode } from 'react';

import type { ComplexityLevel } from '../../../types/diagnosis/DSS/complexityLevel';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

interface Props {
    level: ComplexityLevel;
    onClose: () => void;
}

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className="mt-2 text-sm text-ink">
                {value}
            </div>
        </div>
    );
}

export default function ViewComplexityLevelModal({
    level,
    onClose,
}: Props) {
    return (
        <Modal
            title={`Рівень складності: ${level.name}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Назва рівня
                    </div>
                    <div className="mt-2 text-xl font-semibold text-ink">
                        {level.name}
                    </div>
                </div>

                <InfoCard
                    label="Опис"
                    value={
                        <div className="whitespace-pre-line leading-6">
                            {level.description}
                        </div>
                    }
                />

                <InfoCard
                    label="ID"
                    value={<span className="font-mono">#{level.id}</span>}
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
