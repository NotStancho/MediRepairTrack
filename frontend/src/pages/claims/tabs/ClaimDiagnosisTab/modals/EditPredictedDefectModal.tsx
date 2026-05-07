// pages/claims/tabs/ClaimDiagnosisTab/modals/EditPredictedDefectModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';

import type { PredictedDefectCategory } from '../../../../../types/diagnosis/DSS/predictedDefectCategory';
import type { UpdatePredictedDefectPayload } from '../../../../../types/diagnosis/DSS/predictedDefectCategoryPayload';

interface Props {
    defect: PredictedDefectCategory;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdatePredictedDefectPayload) => Promise<void>;
}

export default function EditPredictedDefectModal({
                                                     defect,
                                                     updating,
                                                     onClose,
                                                     onSave,
                                                 }: Props) {
    const [form, setForm] = useState({
        probabilityScore: defect.probabilityScore?.toString() ?? '',
        rankPosition: defect.rankPosition?.toString() ?? '',
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
            title={`Редагувати дефект "${defect.defectCategory.name}"`}
            onClose={onClose}
            width="md"
        >
            <div className="space-y-3">
                {defect.defectCategory.description && (
                    <div className="text-sm text-ink-muted">
                        {defect.defectCategory.description}
                    </div>
                )}

                {defect.defectCategory.typicalSymptoms && (
                    <div className="text-sm text-ink-muted">
                        <span className="font-medium text-ink">Типові симптоми:</span>{' '}
                        {defect.defectCategory.typicalSymptoms}
                    </div>
                )}

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