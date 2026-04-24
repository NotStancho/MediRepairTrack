// components/claims/tabs/ClaimEmployeesTab/modals/EditClaimEmployeeModal.tsx

import { useState } from 'react';

import type { ClaimEmployee } from '../../../../../types/claimEmployee';
import type { UpdateClaimEmployeePayload } from '../../../../../types/claim/claimEmployeePayloads';

import Button from '../../../../../ui/Button';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';

import {
    EMPLOYEE_POSITION_COLORS,
    EMPLOYEE_POSITION_LABELS,
} from '../../../../../utils/employeeLabels';
import {
    ROLE_IN_CLAIM_COLORS,
    ROLE_IN_CLAIM_LABELS,
    ROLE_IN_CLAIM_OPTIONS,
} from '../../../../../utils/roleInClaimLabels';

interface Props {
    claimEmployee: ClaimEmployee;
    performedByEmployeeId: number;
    saving: boolean;
    onClose: () => void;
    onSave: (payload: UpdateClaimEmployeePayload) => Promise<void>;
}

export default function EditClaimEmployeeModal({
    claimEmployee,
    performedByEmployeeId,
    saving,
    onClose,
    onSave,
}: Props) {
    const [roleInClaim, setRoleInClaim] = useState(claimEmployee.roleInClaim);
    const [submitted, setSubmitted] = useState(false);

    const roleOptions = ROLE_IN_CLAIM_OPTIONS;

    const roleError = submitted && roleInClaim == null
        ? 'Роль у заявці обовʼязкова'
        : undefined;

    const handleSubmit = async () => {
        setSubmitted(true);

        if (!roleInClaim) {
            return;
        }

        await onSave({
            performedByEmployeeId,
            roleInClaim,
        });

        onClose();
    };

    return (
        <Modal title="Редагувати роль працівника" onClose={onClose} width="md">
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-sm font-medium text-ink">
                        {claimEmployee.lastName} {claimEmployee.firstName}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs ${EMPLOYEE_POSITION_COLORS[claimEmployee.position]}`}
                        >
                            {EMPLOYEE_POSITION_LABELS[claimEmployee.position]}
                        </span>
                        <span className="inline-flex rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-ink-muted">
                            Відпрацьовано годин: {claimEmployee.hoursWorked ?? 0}
                        </span>
                    </div>
                </div>

                <InputField
                    label="Роль у заявці"
                    required
                    showRequired={submitted && roleInClaim == null}
                    error={roleError}
                >
                    <Select
                        value={roleInClaim}
                        onChange={setRoleInClaim}
                        options={roleOptions}
                        getLabel={role => ROLE_IN_CLAIM_LABELS[role]}
                        getValue={role => role}
                        renderOption={role => (
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${ROLE_IN_CLAIM_COLORS[role]}`}
                            >
                                {ROLE_IN_CLAIM_LABELS[role]}
                            </span>
                        )}
                        renderValue={role => (
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${ROLE_IN_CLAIM_COLORS[role]}`}
                            >
                                {ROLE_IN_CLAIM_LABELS[role]}
                            </span>
                        )}
                        placeholder="Оберіть роль"
                        disabled={saving}
                        invalid={!!roleError}
                    />
                </InputField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose} disabled={saving}>
                    Скасувати
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={saving || roleInClaim === claimEmployee.roleInClaim}
                >
                    {saving ? 'Збереження…' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
