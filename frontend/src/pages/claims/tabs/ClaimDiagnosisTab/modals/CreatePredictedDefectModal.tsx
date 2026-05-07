// pages/claims/tabs/ClaimDiagnosisTab/modals/CreatePredictedDefectModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import type { DefectCategoryShort } from '../../../../../types/defectCategory/defectCategoryShort';
import type { CreatePredictedDefectPayload } from '../../../../../types/diagnosis/DSS/predictedDefectCategoryPayload';

interface Props {
    predictionId: number;
    available: DefectCategoryShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePredictedDefectPayload) => Promise<void>;
    onCreateBatch: (payload: CreatePredictedDefectPayload[]) => Promise<void>;
}

export default function CreatePredictedDefectModal({
                                                       predictionId,
                                                       available,
                                                       creating,
                                                       onClose,
                                                       onCreate,
                                                   }: Props) {
    const [form, setForm] = useState({
        defectCategoryId: null as number | null,
        probabilityScore: '',
        rankPosition: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            predictionId,
            defectCategoryId: form.defectCategoryId as number,
            probabilityScore: form.probabilityScore
                ? Number(form.probabilityScore)
                : undefined as unknown as number
        });

        onClose();
    };

    return (
        <Modal
            title="Додати прогнозований дефект"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">
                <FormField label="Категорія дефекту">
                    <Select
                        value={form.defectCategoryId}
                        onChange={(val) =>
                            setForm({ ...form, defectCategoryId: val })
                        }
                        options={available}
                        getLabel={(item) => item.name}
                        getValue={(item) => item.id}
                        placeholder="Оберіть категорію дефекту"
                        searchable
                    />
                </FormField>

                <div className="grid grid-cols-1 gap-2">
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