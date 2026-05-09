// pages/equipment/modals/ViewEquipmentModelModal.tsx

import * as React from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';

import type { EquipmentModel } from '../../../types/equipmentModel/equipmentModel';

import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';

import { getEquipmentTypeLabel } from '../../../utils/equipmentLabel';
import EquipmentTypeBadge from '../../../components/badges/EquipmentTypeBadge';
import Badge from '../../../components/badges/Badge';

interface Props {
    model: EquipmentModel;
    onClose: () => void;
}

function InfoCard({
                      label,
                      value,
                  }: {
    label: string;
    value: React.ReactNode;
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

export default function ViewEquipmentModelModal({ model, onClose }: Props) {
    return (
        <Modal
            title={`Модель: ${model.modelName}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Модель обладнання
                            </div>

                            <div className="mt-1 text-xl font-semibold text-ink">
                                {model.modelName}
                            </div>

                            <Badge
                                size="md"
                                colorClassName="border border-border bg-surface text-ink-muted"
                                className="mt-2"
                            >
                                Виробник: {model.manufacturer}
                            </Badge>
                        </div>

                        <div className="shrink-0 rounded-xl border border-border bg-surface px-4 py-3 text-right">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Тип
                            </div>
                            <div className="mt-1 text-base font-semibold text-ink">
                                <EquipmentTypeBadge type={model.type} shape="rounded" className="py-1" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Дата випуску"
                        value={formatDateShort(model.releaseDate)}
                    />

                    <InfoCard
                        label="Тип обладнання"
                        value={getEquipmentTypeLabel(model.type)}
                    />
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>

                    <div className="mt-2 text-sm leading-6 text-ink">
                        {model.description?.trim() || 'Опис відсутній'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(model.createdAt)}
                    />

                    <InfoCard
                        label="Оновлено"
                        value={
                            model.updatedAt
                                ? formatDateTime(model.updatedAt)
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
