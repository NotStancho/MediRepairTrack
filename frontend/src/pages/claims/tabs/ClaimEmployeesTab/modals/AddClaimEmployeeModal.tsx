// pages/claims/tabs/ClaimEmployeesTab/modals/AddClaimEmployeeModal.tsx

import { useState } from 'react';

import { useAssignableClaimEmployees } from '../../../../../hooks/useAssignableClaimEmployees';

import type { EmployeeShort } from '../../../../../types/employee/employee';
import type { RoleInClaim } from '../../../../../types/claim/assignedClaim';
import type { AssignEmployeeToClaimPayload } from '../../../../../types/claim/claimEmployeePayloads';

import Button from '../../../../../ui/Button';
import InputField from '../../../../../ui/InputField';
import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Select from '../../../../../ui/Select';
import TextArea from '../../../../../ui/TextArea';

import {
    EMPLOYEE_AVAILABILITY_LABELS,
    EMPLOYEE_POSITION_LABELS,
} from '../../../../../utils/employeeLabels';
import {
    ROLE_IN_CLAIM_LABELS,
    ROLE_IN_CLAIM_OPTIONS,
} from '../../../../../utils/roleInClaimLabels';
import EmployeeAvailabilityBadge from '../../../../../components/badges/EmployeeAvailabilityBadge';
import EmployeePositionBadge from '../../../../../components/badges/EmployeePositionBadge';
import RoleInClaimBadge from '../../../../../components/badges/RoleInClaimBadge';

interface Props {
    claimId: number;
    performedByEmployeeId: number;
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: AssignEmployeeToClaimPayload) => Promise<void>;
}

export default function AddClaimEmployeeModal({
    claimId,
    performedByEmployeeId,
    creating,
    onClose,
    onCreate,
}: Props) {
    const {
        data: employees,
        loading,
    } = useAssignableClaimEmployees(claimId, performedByEmployeeId);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState<RoleInClaim | null>(null);
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const roleOptions = ROLE_IN_CLAIM_OPTIONS;
    const normalizeNotes = (value: string) => value.trim() || null;

    const canSubmit = selectedEmployeeId != null && selectedRole != null;

    const employeeError = submitted && selectedEmployeeId == null
        ? 'Працівник обовʼязковий'
        : undefined;
    const roleError = submitted && selectedRole == null
        ? 'Роль у заявці обовʼязкова'
        : undefined;

    const handleSubmit = async () => {
        setSubmitted(true);

        if (!canSubmit) {
            return;
        }

        await onCreate({
            performedByEmployeeId,
            employeeId: selectedEmployeeId,
            role: selectedRole,
            notes: normalizeNotes(notes),
        });

        onClose();
    };

    const renderEmployeeOption = (employee: EmployeeShort) => (
        <div className="flex flex-col gap-1 py-1">
            <span className="font-medium text-ink">
                {employee.lastName} {employee.firstName}
            </span>

            <div className="flex flex-wrap gap-2 text-xs">
                <EmployeePositionBadge position={employee.position} />
                <EmployeeAvailabilityBadge status={employee.availabilityStatus} />
            </div>
        </div>
    );

    return (
        <Modal title="Додати працівника до заявки" onClose={onClose} width="lg">
            <div className="space-y-4">
                <InputField
                    label="Працівник"
                    required
                    showRequired={submitted && selectedEmployeeId == null}
                    error={employeeError}
                    helperText={!loading && employees.length === 0
                        ? 'Немає доступних працівників для призначення'
                        : 'У списку відображаються лише доступні для призначення працівники'
                    }
                >
                    <Select
                        value={selectedEmployeeId}
                        onChange={setSelectedEmployeeId}
                        options={employees}
                        getLabel={employee =>
                            [
                                employee.lastName,
                                employee.firstName,
                                EMPLOYEE_POSITION_LABELS[employee.position],
                                EMPLOYEE_AVAILABILITY_LABELS[employee.availabilityStatus],
                            ].join(' ')
                        }
                        getValue={employee => employee.id}
                        renderOption={employee => renderEmployeeOption(employee)}
                        renderValue={employee => (
                            <span className="inline-flex flex-wrap items-center gap-2">
                                <span>
                                    {employee.lastName} {employee.firstName}
                                </span>
                                <EmployeePositionBadge position={employee.position} />
                            </span>
                        )}
                        placeholder="Оберіть працівника"
                        searchable
                        loading={loading}
                        loadingText="Завантаження працівників…"
                        disabled={creating || (!loading && employees.length === 0)}
                        invalid={!!employeeError}
                        itemHeight={72}
                    />
                </InputField>

                <InputField
                    label="Роль у заявці"
                    required
                    showRequired={submitted && selectedRole == null}
                    error={roleError}
                >
                    <Select
                        value={selectedRole}
                        onChange={setSelectedRole}
                        options={roleOptions}
                        getLabel={role => ROLE_IN_CLAIM_LABELS[role]}
                        getValue={role => role}
                        renderOption={role => (
                            <RoleInClaimBadge role={role} />
                        )}
                        renderValue={role => (
                            <RoleInClaimBadge role={role} />
                        )}
                        placeholder="Оберіть роль"
                        disabled={creating}
                        invalid={!!roleError}
                    />
                </InputField>

                <InputField
                    label="Примітки"
                    helperText="Поле не обов'язкове"
                >
                    <TextArea
                        value={notes}
                        onChange={event => setNotes(event.target.value)}
                        placeholder="Додайте примітку до призначення працівника"
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
                    disabled={creating || loading || employees.length === 0}
                >
                    {creating ? 'Додавання…' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
