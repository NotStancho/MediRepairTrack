// pages/employees/modals/CreateEmployeeModal.tsx

import { useState } from 'react';

import type {
    EmployeePosition,
} from '../../../types/employee/employee';

import type {
    RegisterEmployeeWithUserPayload
} from '../../../types/employee/employeePayload';

import Button from '../../../ui/Button';
import FormField from '../../../ui/FormField';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';
import PhoneInput from '../../../ui/PhoneInput';
import Select from '../../../ui/Select';
import { inputBase } from '../../../ui/formStyles';

import {
    EMPLOYEE_POSITION_LABELS,
    EMPLOYEE_POSITION_OPTIONS,
} from '../../../utils/employeeLabels';
import { isPhoneNumberValid } from '../../../utils/phone';
import EmployeePositionBadge from '../../../components/badges/EmployeePositionBadge';

interface Props {
    creating: boolean;
    onClose: () => void;
    onCreate: (payload: RegisterEmployeeWithUserPayload) => Promise<void>;
}

export default function CreateEmployeeModal({
    creating,
    onClose,
    onCreate,
}: Props) {
    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        position: null as EmployeePosition | null,
        ratePerHour: '',
        specialization: '',
    });

    const rateNumber = Number(form.ratePerHour);
    const isPhoneValid = isPhoneNumberValid(form.phone);
    const isRateValid =
        form.ratePerHour.trim() !== '' &&
        !Number.isNaN(rateNumber) &&
        rateNumber > 0;

    const canSubmit =
        form.email.trim() &&
        form.password.trim().length >= 6 &&
        form.firstName.trim() &&
        form.lastName.trim() &&
        isPhoneValid &&
        form.position &&
        isRateValid &&
        form.specialization.trim();

    const handleSubmit = async () => {
        if (!canSubmit || !form.position) return;

        await onCreate({
            email: form.email.trim(),
            password: form.password.trim(),
            firstName: form.firstName.trim(),
            middleName: form.middleName.trim() || null,
            lastName: form.lastName.trim(),
            phone: form.phone.trim(),
            position: form.position,
            ratePerHour: rateNumber,
            specialization: form.specialization.trim(),
        });

        onClose();
    };

    return (
        <Modal title="Додати працівника" onClose={onClose} width="lg">
            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface-muted p-4 text-sm text-ink-muted">
                    Буде створено користувацький кабінет працівника та employee-профіль.
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Email">
                        <input
                            type="email"
                            className={inputBase}
                            value={form.email}
                            onChange={e =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Пароль">
                        <input
                            type="password"
                            className={inputBase}
                            value={form.password}
                            onChange={e =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Ім'я">
                        <input
                            className={inputBase}
                            value={form.firstName}
                            onChange={e =>
                                setForm({ ...form, firstName: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="По батькові">
                        <input
                            className={inputBase}
                            value={form.middleName}
                            onChange={e =>
                                setForm({ ...form, middleName: e.target.value })
                            }
                        />
                    </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Прізвище">
                        <input
                            className={inputBase}
                            value={form.lastName}
                            onChange={e =>
                                setForm({ ...form, lastName: e.target.value })
                            }
                        />
                    </FormField>

                    <FormField label="Телефон">
                        <PhoneInput
                            value={form.phone}
                            onChange={phone =>
                                setForm({ ...form, phone })
                            }
                            required
                            requiredErrorMessage="Телефон обов'язковий"
                            invalidErrorMessage="Телефон має бути у форматі +380 XX XXX XX XX"
                        />
                    </FormField>
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
                </div>

                <FormField label="Спеціалізація">
                    <input
                        className={inputBase}
                        value={form.specialization}
                        onChange={e =>
                            setForm({ ...form, specialization: e.target.value })
                        }
                    />
                </FormField>
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={creating || !canSubmit}
                >
                    {creating ? 'Створення...' : 'Додати'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
