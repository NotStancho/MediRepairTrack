// types/client/client

export interface Client {
    id: number;

    userId: number | null;

    organizationName: string;
    organizationEmail: string;
    organizationPhoneNumber: string;

    contactPersonName: string | null;
    address: string;
    notes: string | null;
}
