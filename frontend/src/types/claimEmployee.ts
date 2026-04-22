// types/claimEmployee
import type { RoleInClaim } from './claim/assignedClaim';
import type { EmployeePosition } from "./employee/employee";

export interface ClaimEmployee {
    employeeId: number;
    firstName: string;
    lastName: string;
    position: EmployeePosition;
    roleInClaim: RoleInClaim;
    hoursWorked: number;
    ratePerHour: number;
    notes?: string;
}
