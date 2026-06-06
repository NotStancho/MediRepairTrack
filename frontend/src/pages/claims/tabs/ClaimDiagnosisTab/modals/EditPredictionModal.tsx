// pages/claims/tabs/ClaimDiagnosisTab/modals/EditPredictionModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import { useComplexityLevels } from '../../../../../hooks/diagnosis/useComplexityLevels';

import type { DiagnosisPrediction } from '../../../../../types/diagnosis/DSS/diagnosisPrediction';
import type { UpdatePredictionPayload } from '../../../../../types/diagnosis/DSS/diagnosisPredictionPayloads';
import ComplexityLevelBadge from '../../../../../components/badges/ComplexityLevelBadge';

interface Props {
    prediction: DiagnosisPrediction;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePredictionPayload) => Promise<void>;
}

export default function EditPredictionModal({
                                                prediction,
                                                updating,
                                                onClose,
                                                onSave
                                            }: Props) {
    const { data: levels, loading: levelsLoading } = useComplexityLevels();

    const [form, setForm] = useState({
        complexityId: prediction.predictedComplexityLevel?.id ?? null as number | null,
        cost: prediction.predictedCost?.toString() ?? '',
        time: prediction.predictedTimeHours?.toString() ?? '',
        explanation: prediction.predictionExplanation ?? ''
    });

    const handleSubmit = async () => {
        const payload: UpdatePredictionPayload = {
            predictedComplexityLevelId: form.complexityId ?? undefined,
            predictedCost: form.cost ? Number(form.cost) : undefined,
            predictedTimeHours: form.time ? Number(form.time) : undefined,
            predictionExplanation: form.explanation || undefined
        };

        await onSave(payload);
        onClose();
    };

    return (
        <Modal
            title={`Редагувати прогноз #${prediction.id}`}
            onClose={onClose}
            width="lg"
            backdrop="dim"
        >
            <div className="space-y-3">
                <FormField label="Рівень складності">
                    <Select
                        value={form.complexityId}
                        onChange={(val) =>
                            setForm({ ...form, complexityId: val })
                        }
                        options={levels}
                        getLabel={(item) => item.name}
                        getValue={(item) => item.id}
                        placeholder="Оберіть рівень складності"
                        loading={levelsLoading}
                        renderOption={(item) => (
                            <ComplexityLevelBadge level={item} shape="rounded" />
                        )}
                        renderValue={(item) => (
                            <ComplexityLevelBadge level={item} shape="rounded" />
                        )}
                        searchable
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Оцінка вартості">
                        <input
                            type="number"
                            value={form.cost}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    cost: e.target.value,
                                })
                            }
                            className={inputBase}
                            placeholder="₴"
                        />
                    </FormField>

                    <FormField label="Оцінка часу (год)">
                        <input
                            type="number"
                            value={form.time}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    time: e.target.value,
                                })
                            }
                            className={inputBase}
                            placeholder="год"
                        />
                    </FormField>
                </div>

                <FormField label="Пояснення">
                    <textarea
                        value={form.explanation}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                explanation: e.target.value,
                            })
                        }
                        className={`${inputBase} min-h-25 resize-none`}
                        placeholder="Опишіть причину прогнозу або логіку оцінки..."
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
                    disabled={updating || levelsLoading}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
