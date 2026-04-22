// types/employee/employeePayload

import type { EmployeeAvailabilityStatus, EmployeePosition } from "./employee";

export interface RegisterEmployeeWithUserPayload {
    email: string;
    password: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    phone: string;
    position: EmployeePosition;
    ratePerHour: number;
    specialization: string;
}

export interface UpdateEmployeePayload {
    position: EmployeePosition;
    ratePerHour: number;
    specialization: string;
    availabilityStatus: EmployeeAvailabilityStatus;
}
