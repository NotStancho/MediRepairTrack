// types/repairWork/repairWork

export interface RepairWork {
    id: number;
    complexityLevelId: number;
    name: string;
    description: string;
    createdByEmployeeId: number;
    createdAt: string;
    updatedAt?: string | null;
}
