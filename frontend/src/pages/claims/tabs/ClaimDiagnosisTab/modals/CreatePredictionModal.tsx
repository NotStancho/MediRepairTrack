// pages/claims/tabs/ClaimDiagnosisTab/modals/CreatePredictionModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';
import Select from '../../../../../ui/Select';

import { useComplexityLevels } from '../../../../../hooks/diagnosis/useComplexityLevels';
import type { CreateManualPredictionPayload } from '../../../../../types/diagnosis/DSS/diagnosisPredictionPayloads';

interface Props {
    diagnosisId: number;
    onClose: () => void;
    onCreated: () => void;

    create: (payload: CreateManualPredictionPayload) => Promise<void>;
    creating: boolean;
}

export default function CreatePredictionModal({
                                                  diagnosisId,
                                                  onClose,
                                                  onCreated,
                                                  create,
                                                  creating
                                              }: Props) {

    const { data: levels, loading: levelsLoading } = useComplexityLevels();

    const [form, setForm] = useState({
        complexityId: null as number | null,
        cost: '',
        time: '',
        explanation: ''
    });

    const handleSubmit = async () => {
        await create({
            diagnosisId,
            predictedComplexityLevelId:
                (form.complexityId ?? undefined) as unknown as number,
            predictedCost: form.cost ? Number(form.cost) : undefined,
            predictedTimeHours: form.time ? Number(form.time) : undefined,
            predictionExplanation: form.explanation
        });

        onCreated();
    };

    return (
        <Modal
            title="Створити прогноз"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">

                <FormField label="Рівень складності">
                    <Select
                        value={form.complexityId ? Number(form.complexityId) : null}
                        onChange={(val) =>
                            setForm({ ...form, complexityId: val })
                        }

                        options={levels}
                        getLabel={(item) => item.name}
                        getValue={(item) => item.id}

                        placeholder="Оберіть рівень складності"
                        loading={levelsLoading}

                        searchable
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Вартість">
                        <input
                            type="number"
                            value={form.cost}
                            onChange={(e) =>
                                setForm({ ...form, cost: e.target.value })
                            }
                            className={inputBase}
                        />
                    </FormField>

                    <FormField label="Час (год)">
                        <input
                            type="number"
                            value={form.time}
                            onChange={(e) =>
                                setForm({ ...form, time: e.target.value })
                            }
                            className={inputBase}
                        />
                    </FormField>
                </div>

                <FormField label="Пояснення">
                    <textarea
                        value={form.explanation}
                        onChange={(e) =>
                            setForm({ ...form, explanation: e.target.value })
                        }
                        className={`${inputBase} min-h-25`}
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
                    disabled={levelsLoading || creating}
                >
                    {creating ? 'Створення...' : 'Створити'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
