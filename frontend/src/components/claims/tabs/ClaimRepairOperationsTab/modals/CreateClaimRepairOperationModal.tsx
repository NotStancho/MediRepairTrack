// components/claim/tabs/ClaimRepairOperationsTab/modals/CreateClaimRepairOperationModal

import { useMemo, useState } from 'react';

import type { ClaimEmployee } from '../../../../../types/claimEmployee';
import type { CreateClaimRepairOperationPayload } from '../../../../../types/claim/claimRepairOperationPayloads';
import type { RepairOperation } from '../../../../../types/repairOperation/repairOperation';

import Button from '../../../../../ui/Button';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';
import TextArea from '../../../../../ui/TextArea';
import { inputBase } from '../../../../../ui/formStyles';

interface Props {
    claimId: number;
    currentEmployee: ClaimEmployee;
    repairOperations: RepairOperation[];
    repairOperationsLoading: boolean;
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateClaimRepairOperationPayload) => Promise<void>;
}

function normalizeOptionalText(value: string) {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

function parsePositiveDecimal(value: string) {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function CreateClaimRepairOperationModal({
    claimId,
    currentEmployee,
    repairOperations,
    repairOperationsLoading,
    creating,
    onClose,
    onCreate,
}: Props) {
    const [selectedOperationId, setSelectedOperationId] = useState<number | null>(null);
    const [timeSpent, setTimeSpent] = useState('');
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const parsedTimeSpent = useMemo(() => parsePositiveDecimal(timeSpent), [timeSpent]);
    const canSubmit = selectedOperationId != null && parsedTimeSpent != null;

    const operationError = submitted && selectedOperationId == null
        ? 'Ремонтна операція обовʼязкова'
        : undefined;
    const timeSpentError = submitted && parsedTimeSpent == null
        ? 'Вкажіть коректний час більше 0'
        : undefined;

    const handleSubmit = async () => {
        setSubmitted(true);

        if (!canSubmit) {
            return;
        }

        await onCreate({
            claimId,
            employeeId: currentEmployee.employeeId,
            operationId: selectedOperationId,
            timeSpent: parsedTimeSpent,
            note: normalizeOptionalText(note),
        });

        onClose();
    };

    return (
        <Modal title="Додати ремонтну роботу" onClose={onClose} width="lg">
            <div className="space-y-4">
                <InputField
                    label="Ремонтна операція"
                    required
                    showRequired={submitted && selectedOperationId == null}
                    error={operationError}
                    helperText={!repairOperationsLoading && repairOperations.length === 0
                        ? 'У довіднику немає доступних ремонтних операцій'
                        : undefined
                    }
                >
                    <Select
                        value={selectedOperationId}
                        onChange={setSelectedOperationId}
                        options={repairOperations}
                        getLabel={operation => [
                            operation.name,
                            operation.description,
                        ].filter(Boolean).join(' ')}
                        getValue={operation => operation.id}
                        renderOption={operation => (
                            <div className="min-w-0 py-1">
                                <div className="font-medium text-ink">
                                    {operation.name}
                                </div>
                                <div className="text-xs text-ink-muted line-clamp-2">
                                    {operation.description}
                                </div>
                            </div>
                        )}
                        renderValue={operation => operation.name}
                        placeholder="Оберіть ремонтну роботу"
                        searchable
                        loading={repairOperationsLoading}
                        loadingText="Завантаження робіт…"
                        disabled={creating || (!repairOperationsLoading && repairOperations.length === 0)}
                        invalid={!!operationError}
                        itemHeight={48}
                        maxVisibleItems={5}
                    />
                </InputField>

                <InputField
                    label="Час виконання"
                    required
                    showRequired={submitted && parsedTimeSpent == null}
                    error={timeSpentError}
                    helperText="У годинах, наприклад 1.5"
                >
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={timeSpent}
                        onChange={event => setTimeSpent(event.target.value)}
                        className={`${inputBase} font-mono`}
                        disabled={creating}
                    />
                </InputField>

                <InputField
                    label="Примітка"
                    helperText="Поле не обов'язкове"
                >
                    <TextArea
                        value={note}
                        onChange={event => setNote(event.target.value)}
                        placeholder="Додайте деталі про виконану роботу"
                        disabled={creating}
                    />
                </InputField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose} disabled={creating}>
                    Скасувати
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={
                        creating ||
                        repairOperationsLoading ||
                        repairOperations.length === 0
                    }
                >
                    {creating ? 'Додавання…' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
