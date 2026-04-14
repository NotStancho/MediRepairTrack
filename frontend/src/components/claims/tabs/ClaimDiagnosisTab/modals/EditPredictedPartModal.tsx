import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';

import type { PredictedPart } from '../../../../../types/diagnosis/DSS/predictedPart';
import type { UpdatePredictedPartPayload } from '../../../../../types/diagnosis/DSS/predictedPartPayloads';

interface Props {
    part: PredictedPart;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePredictedPartPayload) => Promise<void>;
}

export default function EditPredictedPartModal({
                                                   part,
                                                   updating,
                                                   onClose,
                                                   onSave,
                                               }: Props) {
    const [form, setForm] = useState({
        probabilityScore: part.probabilityScore?.toString() ?? '',
        rankPosition: part.rankPosition?.toString() ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            probabilityScore: form.probabilityScore
                ? Number(form.probabilityScore)
                : undefined
        });

        onClose();
    };

    return (
        <Modal
            title={`Редагувати запчастину "${part.part.partName}"`}
            onClose={onClose}
            width="md"
        >
            <div className="space-y-3">
                <div className="text-sm text-ink-muted">
                    Код: {part.part.partCode}
                </div>

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