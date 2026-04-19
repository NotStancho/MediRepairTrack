// types/client/clientPayloads

export interface CreateClientPayload {
    organizationName: string;
    organizationEmail: string;
    organizationPhoneNumber: string;
    contactPersonName?: string | null;
    address: string;
    notes?: string | null;
}

export interface UpdateClientPayload {
    organizationName: string;
    organizationEmail: string;
    organizationPhoneNumber: string;
    contactPersonName?: string | null;
    address: string;
    notes?: string | null;
}
