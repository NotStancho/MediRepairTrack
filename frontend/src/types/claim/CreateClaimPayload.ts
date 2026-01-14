// types/claim/CreateClaimPayload
// base
import type {ClaimStatus, RepairType} from "./claim";

export interface BaseCreateClaimPayload {
    clientId: number;
    defectDescription: string;
    equipment: {
        modelId: number;
        serialNumber: string;
        purchaseDate?: string;
        price?: number;
        description?: string | null;
    };
}

// client
export interface CreateClaimByClientPayload
    extends BaseCreateClaimPayload {}

// employee
export interface CreateClaimByEmployeePayload
    extends BaseCreateClaimPayload {
    employeeId: number;
    repairType: RepairType;
    status: ClaimStatus;
}
