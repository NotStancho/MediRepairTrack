export type UserRole = 'CLIENT' | 'EMPLOYEE' | 'ADMIN';
export type EmployeePosition =
    | 'MANAGER'
    | 'SERVICE_ENGINEER'
    | 'COURIER'
    | 'TECHNICIAN'
    | 'SYSTEM';

export interface AuthUser {
    userId: number;
    email: string;
    role: UserRole;

    firstName: string;
    lastName: string;

    clientId?: number | null;
    employeeId?: number | null;
    position?: EmployeePosition | null;
}
