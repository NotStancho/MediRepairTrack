import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import type { ClaimShort } from '../../../../../types/claim/claimShort';
import type { CreateSimilarityResultPayload } from '../../../../../types/diagnosis/DSS/similarityResultPayloads';

interface Props {
    predictionId: number;
    available: ClaimShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateSimilarityResultPayload) => Promise<void>;
    onCreateBatch: (payload: CreateSimilarityResultPayload[]) => Promise<void>;
}

export default function CreateSimilarityResultModal({
                                                        predictionId,
                                                        available,
                                                        creating,
                                                        onClose,
                                                        onCreate,
                                                    }: Props) {
    const [form, setForm] = useState({
        claimId: null as number | null,
        similarityScore: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            predictionId,
            similarClaimId: form.claimId as number,
            similarityScore: form.similarityScore
                ? Number(form.similarityScore)
                : undefined as unknown as number,
        });

        onClose();
    };

    return (
        <Modal
            title="Додати схожу заявку"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">
                <FormField label="Заявка">
                    <Select
                        value={form.claimId}
                        onChange={(val) =>
                            setForm({ ...form, claimId: val })
                        }
                        options={available}
                        getLabel={(item) =>
                            `№${item.id} - ${item.equipmentModel} (${item.serialNumber})`
                        }
                        getValue={(item) => item.id}
                        placeholder="Оберіть заявку"
                        searchable
                        itemHeight={72}
                        maxVisibleItems={4}
                        renderValue={(item) => (
                            <div className="truncate">
                                №{item.id} • {item.equipmentModel} • {item.serialNumber}
                            </div>
                        )}
                        renderOption={(item) => (
                            <div className="flex flex-col py-1 min-w-0">
                                <div className="font-medium text-sm">
                                    №{item.id} • {item.equipmentModel}
                                </div>

                                <div className="text-xs text-ink-muted">
                                    Серійний номер: {item.serialNumber}
                                </div>

                                <div
                                    className="text-xs text-ink-muted truncate"
                                    title={item.defectDescription}
                                >
                                    {item.defectDescription}
                                </div>
                            </div>
                        )}
                    />
                </FormField>

                <FormField label="Схожість">
                    <input
                        type="number"
                        step="0.01"
                        value={form.similarityScore}
                        onChange={(e) =>
                            setForm({ ...form, similarityScore: e.target.value })
                        }
                        className={inputBase}
                        placeholder="0.85"
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
                    disabled={creating}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}