// types/client/clientFull
export interface ClientFull {
    id: number;

    userId: number | null;
    userEmail: string | null;
    userFirstName: string | null;
    userMiddleName: string | null;
    userLastName: string | null;
    userPhone: string | null;

    organizationName: string;
    organizationEmail: string;
    organizationPhoneNumber: string;
    contactPersonName: string | null;
    address: string;
    notes: string | null;
}
