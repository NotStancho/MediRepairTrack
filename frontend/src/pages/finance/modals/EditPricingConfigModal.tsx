// pages/finance/modals/EditPricingConfigModal.tsx

import { useMemo, useState } from 'react';

import type {
    PricingConfig,
    UpdatePricingConfigPayload,
} from '../../../types/pricingConfig';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import { inputBase } from '../../../ui/formStyles';

import { REPAIR_TYPE_LABELS } from '../../../utils/claimLabels';

interface Props {
    config: PricingConfig;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePricingConfigPayload) => Promise<void>;
}

export default function EditPricingConfigModal({
    config,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        laborPricePerHour: String(config.laborPricePerHour),
        laborMinHours: config.laborMinHours == null ? '' : String(config.laborMinHours),
        partsCoefficient: String(config.partsCoefficient),
        deliveryCoefficient: String(config.deliveryCoefficient),
        description: config.description ?? '',
    });

    const canSubmit = useMemo(() => {
        const hasRequiredValues =
            form.laborPricePerHour.trim() !== '' &&
            form.partsCoefficient.trim() !== '' &&
            form.deliveryCoefficient.trim() !== '';

        const laborPricePerHour = Number(form.laborPricePerHour);
        const partsCoefficient = Number(form.partsCoefficient);
        const deliveryCoefficient = Number(form.deliveryCoefficient);
        const laborMinHours = form.laborMinHours.trim() === ''
            ? null
            : Number(form.laborMinHours);

        const requiredValid =
            Number.isFinite(laborPricePerHour) &&
            laborPricePerHour >= 0 &&
            Number.isFinite(partsCoefficient) &&
            partsCoefficient >= 0 &&
            Number.isFinite(deliveryCoefficient) &&
            deliveryCoefficient >= 0;

        const minHoursValid =
            laborMinHours == null ||
            (Number.isFinite(laborMinHours) && laborMinHours >= 0);

        return hasRequiredValues && requiredValid && minHoursValid;
    }, [form]);

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            laborPricePerHour: Number(form.laborPricePerHour),
            laborMinHours:
                form.laborMinHours.trim() === ''
                    ? null
                    : Number(form.laborMinHours),
            partsCoefficient: Number(form.partsCoefficient),
            deliveryCoefficient: Number(form.deliveryCoefficient),
            description: form.description.trim() || null,
        });

        onClose();
    };

    return (
        <Modal
            title={`Редагувати тариф: ${REPAIR_TYPE_LABELS[config.repairType]}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Тип ремонту
                    </div>
                    <div className="mt-2 text-sm font-medium text-ink">
                        {REPAIR_TYPE_LABELS[config.repairType]}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Вартість робіт за годину">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputBase}
                            value={form.laborPricePerHour}
                            onChange={e =>
                                setForm({ ...form, laborPricePerHour: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Мінімальні години (опціонально)">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputBase}
                            value={form.laborMinHours}
                            onChange={e =>
                                setForm({ ...form, laborMinHours: e.target.value })
                            }
                            placeholder="Не задано"
                        />
                    </FormField>

                    <FormField label="Коефіцієнт запчастин">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputBase}
                            value={form.partsCoefficient}
                            onChange={e =>
                                setForm({ ...form, partsCoefficient: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Коефіцієнт доставки">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputBase}
                            value={form.deliveryCoefficient}
                            onChange={e =>
                                setForm({ ...form, deliveryCoefficient: e.target.value })
                            }
                        />
                    </FormField>
                </div>

                <FormField label="Опис">
                    <textarea
                        className={`${inputBase} h-32 py-2`}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Коментар або пояснення до тарифу"
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={updating || !canSubmit}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
