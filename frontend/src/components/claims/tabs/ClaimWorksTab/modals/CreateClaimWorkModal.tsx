// components/claim/tabs/ClaimWorksTab/modals/CreateClaimWorkModal

import { useMemo, useState } from 'react';

import type { ClaimEmployee } from '../../../../../types/claimEmployee';
import type { CreateClaimWorkPayload } from '../../../../../types/claim/claimWorkPayloads';
import type { RepairWork } from '../../../../../types/repairWork/repairWork';

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
    repairWorks: RepairWork[];
    repairWorksLoading: boolean;
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: CreateClaimWorkPayload) => Promise<void>;
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

export default function CreateClaimWorkModal({
                                                            claimId,
                                                            currentEmployee,
                                                            repairWorks,
                                                            repairWorksLoading,
                                                            creating,
                                                            onClose,
                                                            onCreate,
                                                        }: Props) {
    const [selectedRepairWorkId, setSelectedRepairWorkId] = useState<number | null>(null);
    const [timeSpent, setTimeSpent] = useState('');
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const parsedTimeSpent = useMemo(() => parsePositiveDecimal(timeSpent), [timeSpent]);
    const canSubmit = selectedRepairWorkId != null && parsedTimeSpent != null;

    const repairWorkError = submitted && selectedRepairWorkId == null
        ? 'Ремонтна робота обовʼязкова'
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
            repairWorkId: selectedRepairWorkId,
            timeSpent: parsedTimeSpent,
            note: normalizeOptionalText(note),
        });

        onClose();
    };

    return (
        <Modal title="Додати ремонтну роботу" onClose={onClose} width="lg">
            <div className="space-y-4">
                <InputField
                    label="Ремонтна робота"
                    required
                    showRequired={submitted && selectedRepairWorkId == null}
                    error={repairWorkError}
                    helperText={!repairWorksLoading && repairWorks.length === 0
                        ? 'У довіднику немає доступних ремонтних робіт'
                        : undefined
                    }
                >
                    <Select
                        value={selectedRepairWorkId}
                        onChange={setSelectedRepairWorkId}
                        options={repairWorks}
                        getLabel={repairWork => [
                            repairWork.name,
                            repairWork.description,
                        ].filter(Boolean).join(' ')}
                        getValue={repairWork => repairWork.id}
                        renderOption={repairWork => (
                            <div className="min-w-0 py-1">
                                <div className="font-medium text-ink">
                                    {repairWork.name}
                                </div>
                                <div className="text-xs text-ink-muted line-clamp-2">
                                    {repairWork.description}
                                </div>
                            </div>
                        )}
                        renderValue={repairWork => repairWork.name}
                        placeholder="Оберіть ремонтну роботу"
                        searchable
                        loading={repairWorksLoading}
                        loadingText="Завантаження робіт…"
                        disabled={creating || (!repairWorksLoading && repairWorks.length === 0)}
                        invalid={!!repairWorkError}
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
                        repairWorksLoading ||
                        repairWorks.length === 0
                    }
                >
                    {creating ? 'Додавання…' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
