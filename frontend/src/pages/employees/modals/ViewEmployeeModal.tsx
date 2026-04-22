// pages/employees/modals/ViewEmployeeModal.tsx

import type { ReactNode } from 'react';

import type { EmployeeFull } from '../../../types/employee/employee';

import Button from '../../../ui/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalFooter from '../../../ui/Modal/ModalFooter';

import { formatDateShort } from '../../../utils/formats/dateShortFormat';
import { formatMoney } from '../../../utils/formats/moneyFormat';
import {
    EMPLOYEE_AVAILABILITY_COLORS,
    EMPLOYEE_AVAILABILITY_LABELS,
    EMPLOYEE_POSITION_COLORS,
    EMPLOYEE_POSITION_LABELS,
} from '../../../utils/employeeLabels';

const ROLE_LABELS: Record<EmployeeFull['role'], string> = {
    CLIENT: 'Клієнт',
    EMPLOYEE: 'Працівник',
    ADMIN: 'Адміністратор',
};

function InfoCard({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-surface-muted p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {label}
            </div>
            <div className={`mt-2 text-sm text-ink ${mono ? 'font-mono' : ''}`}>
                {value}
            </div>
        </div>
    );
}

export default function ViewEmployeeModal({ employee, onClose }: {
    employee: EmployeeFull;
    onClose: () => void;
}) {
    const fullName = [
        employee.lastName,
        employee.firstName,
        employee.middleName,
    ].filter(Boolean).join(' ');

    return (
        <Modal
            title={`Працівник: ${fullName || `#${employee.id}`}`}
            onClose={onClose}
            width="lg"
        >
            <div className="space-y-5">
                <div className="rounded-2xl border border-border bg-linear-to-r from-brand-soft to-surface p-5">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                        Профіль працівника
                    </div>
                    <div className="mt-2 text-xl font-semibold text-ink">
                        {fullName}
                    </div>
                    <div className="mt-2 text-sm text-ink-muted">
                        {employee.email}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm ${EMPLOYEE_POSITION_COLORS[employee.position]}`}
                        >
                            {EMPLOYEE_POSITION_LABELS[employee.position]}
                        </span>
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm ${EMPLOYEE_AVAILABILITY_COLORS[employee.availabilityStatus]}`}
                        >
                            {EMPLOYEE_AVAILABILITY_LABELS[employee.availabilityStatus]}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoCard label="ID працівника" value={`#${employee.id}`} mono />
                    <InfoCard label="ID користувача" value={`#${employee.userId}`} mono />
                    <InfoCard label="Телефон" value={employee.phone} mono />
                    <InfoCard label="Роль" value={ROLE_LABELS[employee.role]} />
                    <InfoCard
                        label="Ставка за годину"
                        value={`${formatMoney(employee.ratePerHour)} грн/год`}
                        mono
                    />
                    <InfoCard
                        label="Дата найму"
                        value={formatDateShort(employee.hireDate)}
                    />
                </div>

                <InfoCard label="Спеціалізація" value={employee.specialization} />
            </div>

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Закрити
                </Button>
            </ModalFooter>
        </Modal>
    );
}
