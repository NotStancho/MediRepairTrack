// types/clientContract/clientContractPayloads

import type { ContractStatus } from './contractStatus';
import type { ContractType } from './contractType';

export interface CreateClientContractPayload {
    clientId: number;
    contractName: string;
    contractType: ContractType;
    validFrom: string;
    validTo: string;
    discountLabor: number;
    discountParts: number;
    discountDelivery: number;
    notes?: string | null;
}

export interface UpdateClientContractPayload {
    contractName: string;
    contractType: ContractType;
    status: ContractStatus;
    validFrom: string;
    validTo: string;
    discountLabor: number;
    discountParts: number;
    discountDelivery: number;
    notes?: string | null;
}
