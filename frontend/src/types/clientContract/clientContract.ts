// types/clientContract/clientContract

import type { ContractStatus } from './contractStatus';
import type { ContractType } from './contractType';

export interface ClientContract {
    id: number;
    clientId: number;
    clientOrganizationName: string;

    contractName: string;
    contractType: ContractType;
    status: ContractStatus;

    validFrom: string;
    validTo: string;

    discountLabor: number;
    discountParts: number;
    discountDelivery: number;

    notes: string | null;
    createdAt: string;
    updatedAt?: string | null;
}
