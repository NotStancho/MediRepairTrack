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
    actionType: ClaimHistoryActionType;
    description: string;
    actionDate: string;
}
