// types/claim/claimShort.ts

import type { ClaimStatus, RepairType } from './claim';

export interface ClaimShort {
    id: number;

    equipmentModel: string;
    serialNumber: string;

    defectDescription: string;

    repairType: RepairType;
    status: ClaimStatus;

    createdAt: string;
}