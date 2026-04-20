// pages/finance/tabs/PricingConfigTab.tsx

import { useState, type ReactNode } from 'react';

import { usePricingConfigs } from '../../../hooks/usePricingConfigs';

import type { PricingConfig } from '../../../types/pricingConfig';

import Button from '../../../ui/Button';

import { REPAIR_TYPE_COLORS, REPAIR_TYPE_LABELS } from '../../../utils/claimLabels';
import { formatHours } from "../../../utils/formats/hourFormat";
import { formatDateTime } from '../../../utils/formats/dateFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';

import EditPricingConfigModal from '../modals/EditPricingConfigModal';

function MetricCard({
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

function formatMultiplier(value: number | null | undefined) {
    if (value == null) return '—';
    return `×${value.toLocaleString('uk-UA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

export default function PricingConfigTab() {
    const {
        data,
        loading,
        updatingRepairType,
        update,
    } = usePricingConfigs();

    const [editingItem, setEditingItem] = useState<PricingConfig | null>(null);

    if (loading && !data.length) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-muted">
                Завантаження тарифів...
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-muted">
                Тарифи ще не налаштовані
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {data.map(config => (
                    <div
                        key={config.repairType}
                        className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-black/5"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${REPAIR_TYPE_COLORS[config.repairType]}`}>
                                    {REPAIR_TYPE_LABELS[config.repairType]}
                                </span>
                                <div className="mt-3 text-sm leading-6 text-ink-muted">
                                    {config.description?.trim() || 'Опис тарифу не вказаний'}
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={() => setEditingItem(config)}
                                disabled={updatingRepairType === config.repairType}
                            >
                                {updatingRepairType === config.repairType ? 'Збереження...' : 'Редагувати'}
                            </Button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <MetricCard
                                label="Роботи за годину"
                                value={formatMoney(config.laborPricePerHour)}
                                mono
                            />
                            <MetricCard
                                label="Мінімальні години"
                                value={formatHours(config.laborMinHours)}
                                mono
                            />
                            <MetricCard
                                label="Коефіцієнт запчастин"
                                value={formatMultiplier(config.partsCoefficient)}
                                mono
                            />
                            <MetricCard
                                label="Коефіцієнт доставки"
                                value={formatMultiplier(config.deliveryCoefficient)}
                                mono
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted">
                            <div>
                                Створено:{' '}
                                <span className="text-ink">
                                    {formatDateTime(config.createdAt)}
                                </span>
                            </div>
                            <div>
                                Оновлено:{' '}
                                <span className="text-ink">
                                    {config.updatedAt
                                        ? formatDateTime(config.updatedAt)
                                        : 'Ще не оновлювалось'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <EditPricingConfigModal
                    config={editingItem}
                    updating={updatingRepairType === editingItem.repairType}
                    onClose={() => setEditingItem(null)}
                    onSave={async payload => {
                        const updated = await update(editingItem.repairType, payload);
                        setEditingItem(updated);
                    }}
                />
            )}
        </div>
    );
}
