// types/repairOperation/repairOperationPayloads.ts

export interface CreateRepairOperationPayload {
    complexityLevelId: number;
    name: string;
    description: string;
}

export interface UpdateRepairOperationPayload {
    complexityLevelId: number;
    name: string;
    description: string;
}
