import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { useEquipmentModels } from '../../hooks/useEquipmentModels';
import { useEquipmentResolver } from '../../hooks/useEquipmentResolver';
import { useClientSearch } from '../../hooks/useClientSearch';

import Input from '../../ui/Input';
import InputField from '../../ui/InputField';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import Select from '../../ui/Select';

import { createClaimByEmployee } from '../../api/claim';
import { showApiError } from '../../utils/toastError';
import toast from 'react-hot-toast';

import { CLAIM_STATUS_LABELS, REPAIR_TYPE_LABELS } from '../../utils/claimLabels';

import type { ClaimStatus, RepairType } from '../../types/claim/claim';
import type { EmployeePosition } from "../../types/auth";
import type { ClientSearch } from "../../types/client/ClientSearch";

export default function ClaimCreateEmployeePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const allowedPositions: EmployeePosition[] = ['MANAGER', 'SERVICE_ENGINEER'];

    // ===== CLIENT SEARCH =====
    const [clientQuery, setClientQuery] = useState('');
    const { clients, loading: clientsLoading } = useClientSearch(clientQuery);

    // ===== FORM STATE =====
    const [selectedClient, setSelectedClient] = useState<ClientSearch | null>(null);

    const [repairType, setRepairType] = useState<RepairType | null>(null);
    const [status, setStatus] = useState<ClaimStatus | null>(null);

    const [defectDescription, setDefectDescription] = useState('');
    const [modelId, setModelId] = useState<number | null>(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [price, setPrice] = useState('');
    const [equipmentDescription, setEquipmentDescription] = useState('');

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        shortData: models,
        shortLoading: modelsLoading
    } = useEquipmentModels();
    const { checking, exists, isNew } = useEquipmentResolver(modelId, serialNumber);

    if (!user || (user.role !== 'EMPLOYEE' && user.role !== 'ADMIN') || (user.role === 'EMPLOYEE' && !allowedPositions.includes(user.position!))) {
        return null;
    }

    // ===== VALIDATION =====
    const isFormValid =
        selectedClient != null &&
        repairType != null &&
        status != null &&
        modelId != null &&
        serialNumber.trim() &&
        defectDescription.trim() &&
        (exists || (isNew && purchaseDate && price));

    const isButtonDisabled = loading || checking || !isFormValid;

    const isQueryTooShort = clientQuery.trim().length > 0 && clientQuery.trim().length < 2;

    const missingFields: string[] = [];

    if (!selectedClient) missingFields.push('клієнта');
    if (!repairType) missingFields.push('тип ремонту');
    if (!status) missingFields.push('статус');
    if (!modelId) missingFields.push('модель обладнання');
    if (!serialNumber.trim()) missingFields.push('серійний номер');
    if (!defectDescription.trim()) missingFields.push('опис несправності');

    if (isNew) {
        if (!purchaseDate) missingFields.push('дату купівлі');
        if (!price) missingFields.push('ціну');
    }

    const showHint =
        missingFields.length > 0 &&
        !submitted &&
        !loading;

    const hintText =
        missingFields.length === 1
            ? `Заповніть ${missingFields[0]}`
            : `Заповніть: ${missingFields.join(', ')}`;

    // ===== SUBMIT =====
    const handleSubmit = async () => {
        setSubmitted(true);
        if (!isFormValid) return;

        const payload = {
            employeeId: user.employeeId!,
            clientId: selectedClient!.id,
            repairType,
            status,
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
            const created = await createClaimByEmployee(payload);
            toast.success('Заявку успішно створено');
            navigate(`/employee/claims/${created.id}`);
        } catch (e: any) {
            showApiError(
                e.response?.data ?? { message: 'Не вдалося створити заявку' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl space-y-6">
                <h1 className="text-2xl font-bold">
                    Створення заявки
                </h1>

                {/* ===== CLIENT ===== */}
                <div className="space-y-4 rounded-xl border border-border p-5 bg-surface shadow-sm">
                    <h2 className="text-lg font-semibold">Клієнт</h2>

                    {isQueryTooShort && (
                        <div className="text-sm text-danger">
                            Введіть мінімум 2 символи для пошуку
                        </div>
                    )}
                    {clients.length === 0 && clientQuery.length >= 2 && !clientsLoading && (
                        <div className="text-sm text-danger">
                            Клієнтів не знайдено
                        </div>
                    )}
                    <InputField
                        label="Пошук клієнта"
                        required
                        showRequired={submitted && !selectedClient}
                        error={
                            submitted && !selectedClient
                                ? 'Клієнт обовʼязковий'
                                : undefined
                        }
                    >
                        <Select
                            value={selectedClient?.id ?? null}
                            onChange={(id) => {
                                const client = clients.find(c => c.id === id) ?? null;
                                setSelectedClient(client);
                            }}
                            options={clients}
                            getLabel={c =>
                                `${c.organizationName}, ${c.organizationPhoneNumber}, ${c.organizationEmail}, ${c.contactPersonName}`
                            }
                            getValue={c => c.id}
                            searchable
                            onSearchChange={setClientQuery}
                            loading={clientsLoading}
                            placeholder="Введіть назву або email…"
                        />
                    </InputField>

                    {selectedClient && (
                        <div className="rounded-md border border-border bg-surface-muted p-4 text-sm">
                            <div className="font-medium text-ink mb-2">
                                Обраний клієнт:
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                <div>
                                    <span className="text-ink-muted">Організація:</span><br />
                                    {selectedClient.organizationName}
                                </div>

                                <div>
                                    <span className="text-ink-muted">Email:</span><br />
                                    {selectedClient.organizationEmail}
                                </div>

                                <div>
                                    <span className="text-ink-muted">Телефон:</span><br />
                                    {selectedClient.organizationPhoneNumber}
                                </div>

                                {selectedClient.contactPersonName && (
                                    <div>
                                        <span className="text-ink-muted">Контактна особа:</span><br />
                                        {selectedClient.contactPersonName}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== CLAIM META ===== */}
                <div className="space-y-4 rounded-xl border border-border p-5 bg-surface shadow-sm">
                    <h2 className="text-lg font-semibold">
                        Параметри заявки
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Тип ремонту"
                            required
                            showRequired={submitted && !repairType}
                        >
                            <Select
                                value={repairType}
                                onChange={setRepairType}
                                options={Object.keys(REPAIR_TYPE_LABELS)}
                                getLabel={k => REPAIR_TYPE_LABELS[k as RepairType]}
                                getValue={k => k as RepairType}
                            />
                        </InputField>

                        <InputField
                            label="Початковий статус"
                            required
                            showRequired={submitted && !status}
                        >
                            <Select
                                value={status}
                                onChange={setStatus}
                                options={Object.keys(CLAIM_STATUS_LABELS)}
                                getLabel={k => CLAIM_STATUS_LABELS[k as ClaimStatus]}
                                getValue={k => k as ClaimStatus}
                            />
                        </InputField>
                    </div>
                </div>

                {/* ===== EQUIPMENT ===== */}
                <div className="space-y-4 rounded-xl border border-border p-5 bg-surface shadow-sm">
                    <h2 className="text-lg font-semibold">
                        Дані обладнання
                    </h2>
                    <p className="text-sm text-ink-muted">
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
                            getLabel={m => `${m.modelName} (${m.manufacturer})`}
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
                        <div className="rounded-md bg-surface-muted border border-border px-3 py-2 text-sm text-ink-muted">
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
                <div className="space-y-4 rounded-xl border border-border p-5 bg-surface shadow-sm">
                    <h2 className="text-lg font-semibold">
                        Опис несправності
                    </h2>

                    <InputField
                        label="Опишіть проблему, з якою зіткнувся клієнт під час використання обладнання"
                        required
                        showRequired={submitted && !defectDescription}
                    >
                        <TextArea
                            value={defectDescription}
                            onChange={e => setDefectDescription(e.target.value)}
                            placeholder="Опишіть проблему…"
                        />
                    </InputField>
                </div>

                {/* ===== ACTIONS ===== */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/employee/claims')}
                    >
                        Скасувати
                    </Button>

                    <div className="relative group">
                        <Button
                            variant="primary"
                            disabled={isButtonDisabled}
                            onClick={handleSubmit}
                        >
                            {loading ? 'Збереження…' : 'Створити заявку'}
                        </Button>

                        {showHint && (
                            <div
                                className="
                                    pointer-events-none
                                    absolute -top-8 left-1/2 -translate-x-1/2
                                    whitespace-nowrap
                                    rounded bg-ink px-2 py-1
                                    text-xs text-white
                                    opacity-0
                                    transition
                                    group-hover:opacity-100
                                "
                            >
                                {hintText}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
