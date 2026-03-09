import { useState } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { getAllowedClaimStatuses, updateClaimStatus } from '../../api/claim';
import type { Claim, ClaimStatus } from '../../types/claim/claim';
import { CLAIM_STATUS_LABELS } from '../../utils/claimLabels';

import Button from '../../ui/Button';
import FormField from '../../ui/FormField';
import Modal from '../../ui/Modal/Modal';
import ModalFooter from '../../ui/Modal/ModalFooter';
import Select from '../../ui/Select';

interface Props {
    claim: Claim;
    onUpdated: (claim: Claim) => void;
}

export default function ClaimStatusUpdate({ claim, onUpdated }: Props) {
    const { user } = useAuth();

    const isEmployee = user?.role === 'EMPLOYEE';
    const employeeId = user?.employeeId ?? null;

    const [open, setOpen] = useState(false);
    const [allowed, setAllowed] = useState<ClaimStatus[]>([]);
    const [selected, setSelected] = useState<ClaimStatus | null>(null);
    const [loadingAllowed, setLoadingAllowed] = useState(false);
    const [saving, setSaving] = useState(false);

    if (!isEmployee) return null;

    const openModal = async () => {
        setOpen(true);
        setAllowed([]);
        setSelected(null);
        setLoadingAllowed(true);

        try {
            const next = await getAllowedClaimStatuses(claim.id);
            setAllowed(next);
        } catch {
            toast.error('Не вдалося отримати доступні статуси');
        } finally {
            setLoadingAllowed(false);
        }
    };

    const closeModal = () => {
        if (saving) return;
        setOpen(false);
    };

    const handleSave = async () => {
        if (!employeeId || !selected) return;

        try {
            setSaving(true);
            const updated = await updateClaimStatus(claim.id, employeeId, selected);
            onUpdated(updated);
            toast.success('Статус заявки оновлено');
            setOpen(false);
        } catch {
            toast.error('Помилка оновлення статусу');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex justify-end">
            <Button variant="primary" onClick={openModal} disabled={!employeeId}>
                Оновити статус
            </Button>

            {open && (
                <Modal title="Оновити статус" onClose={closeModal} width="sm">
                    <div className="space-y-4 text-sm">
                        <FormField label="Новий статус">
                            <Select
                                value={selected}
                                onChange={setSelected}
                                options={allowed}
                                getLabel={(s) => CLAIM_STATUS_LABELS[s]}
                                getValue={(s) => s}
                                placeholder="Оберіть статус"
                                loading={loadingAllowed}
                                disabled={loadingAllowed || allowed.length === 0}
                            />
                        </FormField>

                        {!loadingAllowed && allowed.length === 0 && (
                            <div className="text-ink-muted">
                                Для поточного статусу немає доступних переходів.
                            </div>
                        )}

                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                Скасувати
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={!selected || saving}
                            >
                                {saving ? 'Оновлення…' : 'Зберегти'}
                            </Button>
                        </ModalFooter>
                    </div>
                </Modal>
            )}
        </div>
    );
}
