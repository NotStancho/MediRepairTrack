import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';

import type { PredictedWork } from '../../../../../types/diagnosis/DSS/predictedWork';
import type { UpdatePredictedWorkPayload } from '../../../../../types/diagnosis/DSS/predictedWorkPayloads';

interface Props {
    predictedWork: PredictedWork;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePredictedWorkPayload) => Promise<void>;
}

export default function EditPredictedWorkModal({
    predictedWork,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        probabilityScore: predictedWork.probabilityScore?.toString() ?? '',
        predictedTimeSpent: predictedWork.predictedTimeSpent?.toString() ?? '',
        rankPosition: predictedWork.rankPosition?.toString() ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            probabilityScore: form.probabilityScore
                ? Number(form.probabilityScore)
                : undefined,
            predictedTimeSpent: form.predictedTimeSpent
                ? Number(form.predictedTimeSpent)
                : undefined
        });

        onClose();
    };

    return (
        <Modal
            title={`Редагувати роботу "${predictedWork.repairWork.name}"`}
            onClose={onClose}
            width="md"
        >
            <div className="space-y-3">
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
                    disabled={updating}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
