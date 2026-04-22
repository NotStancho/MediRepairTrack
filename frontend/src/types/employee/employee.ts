// types/employee/employee

export type EmployeePosition =
    | 'SERVICE_ENGINEER'
    | 'MANAGER'
    | 'COURIER'
    | 'TECHNICIAN'
    | 'SYSTEM';

export type EmployeeAvailabilityStatus =
    | 'AVAILABLE'
    | 'BUSY'
    | 'ON_LEAVE'
    | 'OFF_SHIFT'
    | 'SICK';

export interface Employee {
    id: number;
    userId: number;

    userEmail: string;
    userFirstName: string;
    userLastName: string;

    position: EmployeePosition;
    ratePerHour: number;
    specialization: string;
    availabilityStatus: EmployeeAvailabilityStatus;
    hireDate: string;
}

export interface EmployeeFull {
    id: number;
    userId: number;

    email: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    phone: string;
    role: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

    position: EmployeePosition;
    ratePerHour: number;
    specialization: string;
    availabilityStatus: EmployeeAvailabilityStatus;
    hireDate: string;
}
