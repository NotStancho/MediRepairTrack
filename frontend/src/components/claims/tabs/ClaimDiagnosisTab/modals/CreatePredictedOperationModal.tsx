// components/claims/tabs/ClaimDiagnosisTab/modals/CreatePredictedOperationModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import type { RepairOperationShort } from '../../../../../types/repairOperation/repairOperationShort';
import type { CreatePredictedOperationPayload } from '../../../../../types/diagnosis/DSS/predictedOperationPayloads';

interface Props {
    predictionId: number;
    available: RepairOperationShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePredictedOperationPayload) => Promise<void>;
    onCreateBatch: (payload: CreatePredictedOperationPayload[]) => Promise<void>;
}

export default function CreatePredictedOperationModal({
                                                          predictionId,
                                                          available,
                                                          creating,
                                                          onClose,
                                                          onCreate,
                                                      }: Props) {
    const [form, setForm] = useState({
        operationId: null as number | null,
        probabilityScore: '',
        predictedTimeSpent: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            predictionId,
            operationId: form.operationId as number,
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
            title="Додати прогнозовану операцію"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">
                <FormField label="Операція">
                    <Select
                        value={form.operationId}
                        onChange={(val) =>
                            setForm({ ...form, operationId: val })
                        }
                        options={available}
                        getLabel={(item) => `${item.name} (${item.complexityLevelName})`}
                        getValue={(item) => item.id}
                        placeholder="Оберіть операцію"
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