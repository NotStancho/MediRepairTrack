// types/repairOperation/repairOperation

export interface RepairOperation {
    id: number;
    complexityLevelId: number;
    name: string;
    description: string;
    createdByEmployeeId: number;
    createdAt: string;
    updatedAt?: string | null;
}
