export type EmployeePosition =
    | 'SERVICE_ENGINEER'
    | 'MANAGER'
    | 'COURIER'
    | 'TECHNICIAN'
    | 'SYSTEM';

export interface Employee {
    id: number;
    userId: number;

    userEmail: string;
    userFirstName: string;
    userLastName: string;

    position: EmployeePosition;
}
