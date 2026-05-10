// types/claim/claimHistory.ts

import type { EmployeeShort } from '../employee/employee';

export type ClaimHistoryActionType =
    | 'STATUS_CHANGE'
    | 'EMPLOYEE_ASSIGNMENT'
    | 'WORK_LOG'
    | 'COMMENT'
    | 'SYSTEM_EVENT'
    | 'PART_USED'
    | 'DELIVERY_EVENT';

export interface ClaimHistory {
    id: number;
    claimId: number;
    employeeId: number;
    employee: EmployeeShort;
    actionType: ClaimHistoryActionType;
    description: string;
    actionDate: string;
}
