// pages/claims/tabs/ClaimDiagnosisTab/modals/CreatePredictedWorkModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import type { RepairWorkShort } from '../../../../../types/repairWork/repairWorkShort';
import type { CreatePredictedWorkPayload } from '../../../../../types/diagnosis/DSS/predictedWorkPayloads';

interface Props {
    predictionId: number;
    available: RepairWorkShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePredictedWorkPayload) => Promise<void>;
    onCreateBatch: (payload: CreatePredictedWorkPayload[]) => Promise<void>;
}

export default function CreatePredictedWorkModal({
                                                          predictionId,
                                                          available,
                                                          creating,
                                                          onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        repairWorkId: null as number | null,
        probabilityScore: '',
        predictedTimeSpent: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            predictionId,
            repairWorkId: form.repairWorkId as number,
            probabilityScore: form.probabilityScore
                ? Number(form.probabilityScore)
                : undefined as unknown as number,
            predictedTimeSpent: form.predictedTimeSpent
                ? Number(form.predictedTimeSpent)
                : undefined as unknown as number,
        });

        onClose();
    };

    return (
        <Modal
            title="Додати прогнозовану роботу"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">
                <FormField label="Робота">
                    <Select
                        value={form.repairWorkId}
                        onChange={(val) =>
                            setForm({ ...form, repairWorkId: val })
                        }
                        options={available}
                        getLabel={(item) => `${item.name} (${item.complexityLevelName})`}
                        getValue={(item) => item.id}
                        placeholder="Оберіть роботу"
                        searchable
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Ймовірність">
                        <input
                            type="number"
                            step="0.01"
                            value={form.probabilityScore}
                            onChange={(e) =>
                                setForm({ ...form, probabilityScore: e.target.value })
                            }
                            className={inputBase}
                            placeholder="0.75"
                        />
                    </FormField>

                    <FormField label="Час (год)">
                        <input
                            type="number"
                            step="0.01"
                            value={form.predictedTimeSpent}
                            onChange={(e) =>
                                setForm({ ...form, predictedTimeSpent: e.target.value })
                            }
                            className={inputBase}
                            placeholder="1.5"
                        />
                    </FormField>
                </div>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={creating}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
