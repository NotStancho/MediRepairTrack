// pages/equipment/modals/ViewEquipmentModal.tsx

import * as React from 'react';

import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Button from '../../../ui/Button';

import type { Equipment } from '../../../types/equipment/equipment';

import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import { formatDateShort } from '../../../utils/formats/dateShortFormat';

interface Props {
    equipment: Equipment;
    onClose: () => void;
}

function InfoCard({
                      label,
                      value,
                      mono = false,
                  }: {
    label: string;
    value: React.ReactNode;
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

export default function ViewEquipmentModal({ equipment, onClose }: Props) {
    return (
        <Modal
            title={`Обладнання: ${equipment.model.modelName}`}
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
                                {equipment.model.modelName}
                            </div>

                            <div className="mt-2 inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink-muted">
                                Виробник: {equipment.model.manufacturer}
                            </div>
                        </div>

                        <div className="shrink-0 rounded-xl border border-border bg-surface px-4 py-3 text-right">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Ціна
                            </div>
                            <div className="mt-1 font-mono text-lg font-semibold text-ink">
                                {formatMoney(equipment.price)} грн
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Серійний номер"
                        value={equipment.serialNumber || '-'}
                        mono
                    />

                    <InfoCard
                        label="Дата купівлі"
                        value={formatDateShort(equipment.purchaseDate)}
                    />
                </div>

                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>

                    <div className="mt-2 text-sm leading-6 text-ink">
                        {equipment.description?.trim() || 'Опис відсутній'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(equipment.createdAt)}
                    />

                    <InfoCard
                        label="Оновлено"
                        value={
                            equipment.updatedAt
                                ? formatDateTime(equipment.updatedAt)
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