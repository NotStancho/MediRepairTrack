// pages/claims/ClaimCreatePage
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';

import {useEquipmentModels} from '../../hooks/useEquipmentModels';
import {useEquipmentResolver} from '../../hooks/useEquipmentResolver';

import Input from '../../ui/Input';
import InputField from '../../ui/InputField';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import Select from '../../ui/Select';

import {createClaimByClient} from '../../api/claim';
import {showApiError} from '../../utils/toastError';
import toast from 'react-hot-toast';

export default function ClaimCreatePage() {
    const {user} = useAuth();
    const navigate = useNavigate();

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

    const {models, loading: modelsLoading} = useEquipmentModels();
    const {checking, exists, isNew} = useEquipmentResolver(modelId, serialNumber);

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
                e.response?.data ?? {message: 'Не вдалося створити заявку'}
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-3xl space-y-6">
                <h1 className="text-2xl font-bold">
                    Подати заявку на ремонт
                </h1>

                {/* ===== EQUIPMENT ===== */}
                <div className="space-y-4 rounded-lg border border-gray-200 p-5 bg-white">
                    <h2 className="text-lg font-semibold">
                        Дані обладнання
                    </h2>
                    <p className="text-sm text-gray-500">
                        Вкажіть модель та серійний номер обладнання, для якого потрібен ремонт
                    </p>
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
                        <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-600">
                            Перевіряємо, чи є таке обладнання в системі…
                        </div>
                    )}

                    {exists && (
                        <p className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                            Таке обладнання вже є в нашій базі. Ми використаємо його дані для цієї заявки.
                        </p>
                    )}

                    {isNew && (
                        <p className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-700">
                            Обладнання з таким серійним номером і моделлю не знайдено в системі.
                            Ми додамо його до системи разом із цією заявкою.
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
                                        max={new Date().toISOString().split('T')[0]}
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
                                />
                            </InputField>
                        </>
                    )}
                </div>

                {/* ===== DEFECT ===== */}
                <div className="space-y-4 rounded-lg border border-gray-200 p-5 bg-white">
                    <h2 className="text-lg font-semibold">
                        Опис несправності
                    </h2>

                    <InputField
                        label="Опишіть проблему, з якою ви зіткнулися під час використання обладнання"
                        required
                        showRequired={submitted && !defectDescription}
                        error={
                            submitted && !defectDescription
                                ? 'Опис несправності обовʼязковий'
                                : undefined
                        }
                    >
                        <TextArea
                            placeholder="Наприклад: обладнання не вмикається після оновлення…"
                            value={defectDescription}
                            invalid={submitted && !defectDescription}
                            onChange={e => setDefectDescription(e.target.value)}
                            maxHeight={300}
                        />
                    </InputField>
                </div>


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
        </div>
    );
}
