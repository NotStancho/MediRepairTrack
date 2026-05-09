// pages/employees/modals/EditEmployeeModal.tsx

import { useState } from 'react';

import type {
    Employee, EmployeeAvailabilityStatus, EmployeePosition,
} from '../../../types/employee/employee';

import type {
    UpdateEmployeePayload
} from '../../../types/employee/employeePayload';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import {
    EMPLOYEE_AVAILABILITY_LABELS,
    EMPLOYEE_AVAILABILITY_OPTIONS,
    EMPLOYEE_POSITION_LABELS,
    EMPLOYEE_POSITION_OPTIONS,
} from '../../../utils/employeeLabels';
import EmployeeAvailabilityBadge from '../../../components/badges/EmployeeAvailabilityBadge';
import EmployeePositionBadge from '../../../components/badges/EmployeePositionBadge';

interface Props {
    employee: Employee;
    updating: boolean;
    onClose: () => void;
    onSave: (payload: UpdateEmployeePayload) => Promise<void>;
}

export default function EditEmployeeModal({
    employee,
    updating,
    onClose,
    onSave,
}: Props) {
    const [form, setForm] = useState({
        position: employee.position as EmployeePosition,
        ratePerHour: String(employee.ratePerHour),
        specialization: employee.specialization,
        availabilityStatus: employee.availabilityStatus as EmployeeAvailabilityStatus,
    });

    const rateNumber = Number(form.ratePerHour);
    const isRateValid =
        form.ratePerHour.trim() !== '' &&
        !Number.isNaN(rateNumber) &&
        rateNumber > 0;

    const canSubmit =
        form.position &&
        isRateValid &&
        form.specialization.trim() &&
        form.availabilityStatus;

    const handleSubmit = async () => {
        if (!canSubmit) return;

        await onSave({
            position: form.position,
            ratePerHour: rateNumber,
            specialization: form.specialization.trim(),
            availabilityStatus: form.availabilityStatus,
        });

        onClose();
    };

    return (
        <Modal title="Редагувати працівника" onClose={onClose} width="lg">
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                    <div className="text-sm font-medium text-ink">
                        {employee.userLastName} {employee.userFirstName}
                    </div>
                    <div className="mt-1 text-sm text-ink-muted">
                        {employee.userEmail}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Посада">
                        <Select
                            value={form.position}
                            onChange={value =>
                                setForm({ ...form, position: value })
                            }
                            options={EMPLOYEE_POSITION_OPTIONS}
                            getLabel={item => EMPLOYEE_POSITION_LABELS[item]}
                            getValue={item => item}
                            renderOption={item => (
                                <EmployeePositionBadge position={item} />
                            )}
                            renderValue={item => (
                                <EmployeePositionBadge position={item} />
                            )}
                        />
                    </FormField>

                    <FormField label="Статус">
                        <Select
                            value={form.availabilityStatus}
                            onChange={value =>
                                setForm({
                                    ...form,
                                    availabilityStatus: value,
                                })
                            }
                            options={EMPLOYEE_AVAILABILITY_OPTIONS}
                            getLabel={item => EMPLOYEE_AVAILABILITY_LABELS[item]}
                            getValue={item => item}
                            renderOption={item => (
                                <EmployeeAvailabilityBadge status={item} />
                            )}
                            renderValue={item => (
                                <EmployeeAvailabilityBadge status={item} />
                            )}
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Ставка за годину">
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            className={inputBase}
                            value={form.ratePerHour}
                            onChange={e =>
                                setForm({ ...form, ratePerHour: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Спеціалізація">
                        <input
                            className={inputBase}
                            value={form.specialization}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    specialization: e.target.value,
                                })
                            }
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
                    disabled={updating || !canSubmit}
                >
                    {updating ? 'Збереження...' : 'Зберегти'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
