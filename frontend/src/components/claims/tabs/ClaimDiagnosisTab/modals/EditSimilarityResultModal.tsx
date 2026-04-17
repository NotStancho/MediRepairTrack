import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';

import type { SimilarityResult } from '../../../../../types/diagnosis/DSS/similarityResult';
import type { UpdateSimilarityResultPayload } from '../../../../../types/diagnosis/DSS/similarityResultPayloads';

interface Props {
    similarity: SimilarityResult;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateSimilarityResultPayload) => Promise<void>;
}

export default function EditSimilarityResultModal({
                                                      similarity,
                                                      updating,
                                                      onClose,
                                                      onSave,
                                                  }: Props) {
    const [form, setForm] = useState({
        similarityScore: similarity.similarityScore?.toString() ?? '',
        rankPosition: similarity.rankPosition?.toString() ?? '',
    });

    const handleSubmit = async () => {
        await onSave({
            similarityScore: form.similarityScore
                ? Number(form.similarityScore)
                : undefined
        });

        onClose();
    };

    return (
        <Modal
            title={`Редагувати схожість для заявки #${similarity.claim.id}`}
            onClose={onClose}
            width="md"
        >
            <div className="space-y-3">
                <div className="text-sm text-ink-muted">
                    {similarity.claim.equipmentModel} · {similarity.claim.serialNumber}
                </div>

                <div
                    className="text-sm text-ink-muted"
                    title={similarity.claim.defectDescription}
                >
                    {similarity.claim.defectDescription}
                </div>

                <div className="grid grid-cols-1 gap-2">
                    <FormField label="Схожість">
                        <input
                            type="number"
                            step="0.01"
                            value={form.similarityScore}
                            onChange={(e) =>
                                setForm({ ...form, similarityScore: e.target.value })
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