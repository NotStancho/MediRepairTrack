// components/claims/tabs/ClaimDiagnosisTab/modals/EditDiagnosisModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';

import type { Diagnosis } from '../../../../../types/diagnosis/diagnosis';
import type { UpdateDiagnosisPayload } from '../../../../../types/diagnosis/diagnosisPayloads';

interface Props {
    diagnosis: Diagnosis;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateDiagnosisPayload) => Promise<void>;
}

export default function EditDiagnosisModal({diagnosis, onClose, onSave, updating }: Props) {

    const [form, setForm] = useState({
        preliminaryConclusion: diagnosis.preliminaryConclusion ?? '',
        finalConclusion: diagnosis.finalConclusion ?? '',
        estimatedCost: diagnosis.estimatedCost?.toString() ?? '',
        estimatedTimeHours: diagnosis.estimatedTimeHours?.toString() ?? '',
    });

    const handleSubmit = async () => {
        const payload: UpdateDiagnosisPayload = {
            preliminaryConclusion: form.preliminaryConclusion || undefined,
            finalConclusion: form.finalConclusion || undefined,
            estimatedCost: form.estimatedCost
                ? Number(form.estimatedCost)
                : undefined,
            estimatedTimeHours: form.estimatedTimeHours
                ? Number(form.estimatedTimeHours)
                : undefined,
        };

        await onSave(payload);
        onClose();
    };

    return (
        <Modal
            title={`Редагувати діагностику #${diagnosis.id}`}
            onClose={onClose}
            width="md"
            backdrop="dim"
        >
            <div className="space-y-3">

                <FormField label="Попередній висновок">
                    <textarea
                        value={form.preliminaryConclusion}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                preliminaryConclusion: e.target.value,
                            })
                        }
                        className={`${inputBase} min-h-[80px] resize-none`}
                    />
                </FormField>

                <FormField label="Фінальний висновок">
                    <textarea
                        value={form.finalConclusion}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                finalConclusion: e.target.value,
                            })
                        }
                        className={`${inputBase} min-h-[80px] resize-none`}
                        placeholder="(опціонально)"
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-2">
                    <FormField label="Оцінка вартості">
                        <input
                            type="number"
                            value={form.estimatedCost}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    estimatedCost: e.target.value,
                                })
                            }
                            className={inputBase}
                            placeholder="₴"
                        />
                    </FormField>

                    <FormField label="Оцінка часу (год)">
                        <input
                            type="number"
                            value={form.estimatedTimeHours}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    estimatedTimeHours: e.target.value,
                                })
                            }
                            className={inputBase}
                            placeholder="год"
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