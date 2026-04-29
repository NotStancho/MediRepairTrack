// types/repairWork/repairWorkPayloads.ts

export interface CreateRepairWorkPayload {
    complexityLevelId: number;
    name: string;
    description: string;
}

export interface UpdateRepairWorkPayload {
    complexityLevelId: number;
    name: string;
    description: string;
}
