import type { EmployeePosition } from '../types/employee';

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
