// components/claims/tabs/ClaimDiagnosisTab/modals/CreatePredictedPartModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import Select from '../../../../../ui/Select';
import { inputBase } from '../../../../../ui/formStyles';

import { formatMoney } from '../../../../../utils/formats/moneyFormat';

import type { PartShort } from '../../../../../types/part/partShort';
import type { CreatePredictedPartPayload } from '../../../../../types/diagnosis/DSS/predictedPartPayloads';

interface Props {
    predictionId: number;
    available: PartShort[];
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreatePredictedPartPayload) => Promise<void>;
    onCreateBatch: (payload: CreatePredictedPartPayload[]) => Promise<void>;
}

export default function CreatePredictedPartModal({
                                                     predictionId,
                                                     available,
                                                     creating,
                                                     onClose,
                                                     onCreate,
                                                 }: Props) {
    const [form, setForm] = useState({
        partId: null as number | null,
        probabilityScore: '',
    });

    const handleSubmit = async () => {
        await onCreate({
            predictionId,
            partId: form.partId as number,
            probabilityScore: form.probabilityScore
                ? Number(form.probabilityScore)
                : undefined as unknown as number,
        });

        onClose();
    };

    return (
        <Modal
            title="Додати прогнозовану запчастину"
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-3">
                <FormField label="Запчастина">
                    <Select
                        value={form.partId}
                        onChange={(val) =>
                            setForm({ ...form, partId: val })
                        }
                        options={available}
                        getLabel={(item) =>
                            `${item.partCode} - ${item.partName} (${formatMoney(item.price)} ₴ / ${item.unitName})`
                        }
                        getValue={(item) => item.id}
                        placeholder="Оберіть запчастину"
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