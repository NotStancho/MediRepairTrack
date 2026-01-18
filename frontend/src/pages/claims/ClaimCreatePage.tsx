// pages/claims/ClaimCreatePage
import {useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// import { useEquipmentModels } from '../../hooks/useEquipmentModels';
import { useEquipmentResolver } from '../../hooks/useEquipmentResolver';

import Input from '../../ui/Input';
import InputField from '../../ui/InputField';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import Select from '../../ui/Select';

import { createClaimByClient } from '../../api/claim';
import { showApiError } from '../../utils/toastError';
import toast from 'react-hot-toast';

import {generateModels} from "../../utils/mockModels.ts";

export default function ClaimCreatePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const models = useMemo(() => generateModels(5000), []);
    const modelsLoading = false;

    // safety check (теоретично не потрібно, але хай буде)
    if (!user || user.role !== 'CLIENT' || !user.clientId) {
        return null;
    }

    // ===== FORM STATE =====
    const [defectDescription, setDefectDescription] = useState('');
    const [modelId, setModelId] = useState<number | null>(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [price, setPrice] = useState('');
    const [equipmentDescription, setEquipmentDescription] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    //const { models, loading: modelsLoading } = useEquipmentModels();
    const { checking, exists, isNew } = useEquipmentResolver(modelId, serialNumber);

    // ===== VALIDATION =====
    const isFormValid =
        modelId != null &&
        serialNumber.trim() &&
        defectDescription.trim() &&
        (exists || (isNew && purchaseDate && price));

    const isButtonDisabled =
        loading ||
        checking ||
        !isFormValid;

    const handleSubmit = async () => {
        setSubmitted(true);

        if (!isFormValid) return;

        const payload = {
            clientId: user.clientId!,
            defectDescription,
            equipment: {
                modelId: modelId as number,
                serialNumber: serialNumber.trim(),

                ...(isNew && {
                    purchaseDate,
                    price: Number(price),
                    description: equipmentDescription || null,
                }),
            },
        };

        try {
            setLoading(true);

            const created = await createClaimByClient(payload);

            toast.success('Заявку успішно створено');
            navigate(`/client/claims/${created.id}`);
        } catch (e: any) {
            showApiError(
                e.response?.data ?? { message: 'Не вдалося створити заявку' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold">
                Подати заявку на ремонт
            </h1>

            {/* ===== EQUIPMENT ===== */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                    Дані обладнання
                </h2>

                <InputField
                    label="Модель обладнання"
                    required
                    showRequired={submitted && !modelId}
                    error={
                        submitted && !modelId
                            ? 'Модель обовʼязкова'
                            : undefined
                    }
                >
                    <Select
                        value={modelId}
                        onChange={setModelId}
                        options={models}
                        getLabel={m => m.modelName}
                        getValue={m => m.id}
                        placeholder="Оберіть модель"
                        searchable
                        loading={modelsLoading}
                        loadingText="Завантаження моделей…"
                        invalid={submitted && !modelId}
                        error={submitted && !modelId ? 'Модель обовʼязкова' : undefined}
                    />

                </InputField>

                <InputField
                    label="Серійний номер"
                    required
                    showRequired={submitted && !serialNumber}
                    error={
                        submitted && !serialNumber
                            ? 'Серійний номер обовʼязковий'
                            : undefined
                    }
                >
                    <Input
                        value={serialNumber}
                        onChange={e => setSerialNumber(e.target.value)}
                        invalid={submitted && !serialNumber}
                        placeholder="Наприклад SN-123456"
                    />
                </InputField>

                {checking && (
                    <p className="text-sm text-gray-500">
                        Перевірка обладнання…
                    </p>
                )}

                {exists && (
                    <p className="text-sm text-green-600">
                        ✔ Обладнання знайдено
                    </p>
                )}

                {isNew && (
                    <p className="text-sm text-yellow-600">
                        ⚠ Обладнання не знайдено — буде створено нове
                    </p>
                )}

                {isNew && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Дата купівлі"
                                required
                                showRequired={submitted && !purchaseDate}
                                error={
                                    submitted && !purchaseDate
                                        ? 'Дата купівлі обовʼязкова'
                                        : undefined
                                }
                            >
                                <Input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={e => setPurchaseDate(e.target.value)}
                                    invalid={submitted && !purchaseDate}
                                />
                            </InputField>

                            <InputField
                                label="Ціна"
                                required
                                showRequired={submitted && !price}
                                error={
                                    submitted && !price
                                        ? 'Ціна обовʼязкова'
                                        : undefined
                                }
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    invalid={submitted && !price}
                                    placeholder="0.00"
                                />
                            </InputField>
                        </div>
                        <InputField label="Опис обладнання (необов'язково)">
                            <TextArea
                                placeholder="Додаткова інформація щодо обладнання"
                                value={equipmentDescription}
                                onChange={e => setEquipmentDescription(e.target.value)}
                                //maxHeight={500}
                                rows={1}
                            />
                        </InputField>
                    </>
                )}
            </div>

            {/* ===== DEFECT ===== */}
            <InputField
                label="Опис несправності"
                required
                showRequired={submitted && !defectDescription}
                error={
                    submitted && !defectDescription
                        ? 'Опис несправності обовʼязковий'
                        : undefined
                }
            >
                <TextArea
                    placeholder="Опишіть проблему з обладнанням"
                    value={defectDescription}
                    invalid={submitted && !defectDescription}
                    onChange={e => setDefectDescription(e.target.value)}
                    maxHeight={300}
                />
            </InputField>

            {/* ===== ACTIONS ===== */}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/client/claims')}
                >
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    disabled={isButtonDisabled}
                    onClick={handleSubmit}
                >
                    {loading ? 'Надсилання…' : 'Подати заявку'}
                </Button>
            </div>
        </div>
    );
}
