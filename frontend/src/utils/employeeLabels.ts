import type {
    EmployeeAvailabilityStatus,
    EmployeePosition,
} from '../types/employee/employee';

export const EMPLOYEE_POSITION_OPTIONS: EmployeePosition[] = [
    'MANAGER',
    'SERVICE_ENGINEER',
    'TECHNICIAN',
    'COURIER',
    'SYSTEM',
];

export const EMPLOYEE_POSITION_LABELS: Record<EmployeePosition, string> = {
    MANAGER: 'Менеджер',
    SERVICE_ENGINEER: 'Сервісний інженер',
    TECHNICIAN: 'Технік',
    COURIER: 'Курʼєр',
    SYSTEM: 'Система',
};

export const EMPLOYEE_POSITION_COLORS: Record<EmployeePosition, string> = {
    MANAGER: 'bg-purple-100 text-purple-800',
    SERVICE_ENGINEER: 'bg-blue-100 text-blue-800',
    TECHNICIAN: 'bg-teal-100 text-teal-800',
    COURIER: 'bg-orange-100 text-orange-800',
    SYSTEM: 'bg-gray-200 text-gray-600',
};

export const EMPLOYEE_AVAILABILITY_OPTIONS: EmployeeAvailabilityStatus[] = [
    'AVAILABLE',
    'BUSY',
    'ON_LEAVE',
    'OFF_SHIFT',
    'SICK',
];

export const EMPLOYEE_AVAILABILITY_LABELS: Record<EmployeeAvailabilityStatus, string> = {
    AVAILABLE: 'Доступний',
    BUSY: 'Зайнятий',
    ON_LEAVE: 'У відпустці',
    OFF_SHIFT: 'Поза зміною',
    SICK: 'На лікарняному',
};

export const EMPLOYEE_AVAILABILITY_COLORS: Record<EmployeeAvailabilityStatus, string> = {
    AVAILABLE: 'bg-emerald-100 text-emerald-800',
    BUSY: 'bg-amber-100 text-amber-800',
    ON_LEAVE: 'bg-indigo-100 text-indigo-800',
    OFF_SHIFT: 'bg-slate-100 text-slate-700',
    SICK: 'bg-rose-100 text-rose-800',
};
