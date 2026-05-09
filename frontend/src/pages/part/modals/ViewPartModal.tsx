//pages/part/modals/ViewPartModal.tsx

import  { type ReactNode } from 'react';

import type { Part } from '../../../types/part/part';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import { formatMoney } from '../../../utils/formats/moneyFormat';
import { formatPartQuantity } from '../../../utils/formats/partQuantityFormat';
import { formatDateTime } from '../../../utils/formats/dateFormat';

import PartUnitTypeBadge from '../../../components/badges/PartUnitTypeBadge';
import Badge from '../../../components/badges/Badge';

interface Props {
    part: Part;
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

export default function ViewPartModal({ part, onClose }: Props) {
    return (
        <Modal
            title={`Запчастина: ${part.partName}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Код запчастини
                            </div>

                            <div className="mt-1 font-mono text-lg font-semibold text-ink">
                                {part.partCode}
                            </div>

                            <div className="mt-2 text-xl font-semibold text-ink">
                                {part.partName}
                            </div>

                            <Badge
                                size="md"
                                colorClassName="border border-border bg-surface text-ink-muted"
                                className="mt-2"
                            >
                                Постачальник: {part.supplierName}
                            </Badge>
                        </div>

                        <div className="shrink-0 rounded-xl border border-border bg-surface px-4 py-3 text-right">
                            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                                Ціна
                            </div>
                            <div className="mt-1 font-mono text-lg font-semibold text-ink">
                                {formatMoney(part.price)} грн
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <InfoCard
                        label="Залишок на складі"
                        value={formatPartQuantity(part.stockQuantity, part.unitName)}
                        mono
                    />

                    <InfoCard
                        label="Тип одиниці"
                        value={<PartUnitTypeBadge type={part.unitType} />}
                    />
                    <InfoCard label="Одиниця виміру" value={part.unitName || '-'} />
                </div>


                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Опис
                    </div>

                    <div className="mt-2 text-sm leading-6 text-ink">
                        {part.description?.trim() || 'Опис відсутній'}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard
                        label="Створено"
                        value={formatDateTime(part.createdAt)}
                    />

                    <InfoCard
                        label="Оновлено"
                        value={
                            part.updatedAt
                                ? formatDateTime(part.updatedAt)
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
