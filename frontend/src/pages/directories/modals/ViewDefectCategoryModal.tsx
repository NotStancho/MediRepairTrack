// pages/directories/modals/ViewDefectCategoryModal.tsx

import type { ReactNode } from 'react';

import type { DefectCategory } from '../../../types/defectCategory/defectCategory';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import { formatDateTime } from '../../../utils/formats/dateFormat';

interface Props {
    defectCategory: DefectCategory;
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

export default function ViewDefectCategoryModal({
    defectCategory,
    onClose,
}: Props) {
    return (
        <Modal
            title={`Категорія дефекту: ${defectCategory.name}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Назва категорії
                    </div>
                    <div className="mt-2 text-xl font-semibold text-ink">
                        {defectCategory.name}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Типові симптоми
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {defectCategory.typicalSymptoms}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>
                    <div className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">
                        {defectCategory.description}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(defectCategory.createdAt)}
                    />
                    <InfoCard
                        label="Оновлено"
                        value={
                            defectCategory.updatedAt
                                ? formatDateTime(defectCategory.updatedAt)
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
