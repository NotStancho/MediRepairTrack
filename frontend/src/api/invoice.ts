import { api } from './api';
import type {Invoice, InvoiceDetail, InvoiceFull} from '../types/invoice';

export const getInvoiceByClaim = async (claimId: number) =>
    (await api.get<Invoice>(`/api/invoice/claim/${claimId}`)).data;

export const getInvoiceFullByClaim = async (claimId: number) =>
    (await api.get<InvoiceFull>(`/api/invoice/claim/${claimId}/full`)).data;

export const createInvoiceDraft = async (claimId: number) =>
    (await api.post<Invoice>(`/api/invoice/claim/${claimId}`)).data;

export const recalcInvoice = async (invoiceId: number) =>
    (await api.post<Invoice>(`/api/invoice/${invoiceId}/recalculate`)).data;

export const issueInvoice = async (invoiceId: number) =>
    (await api.post<Invoice>(`/api/invoice/${invoiceId}/issue`)).data;


export const updateInvoiceDueDate = async (
    invoiceId: number,
    dueAt: string // ISO string
) =>
    (await api.patch(
        `/api/invoice/${invoiceId}/due-date`,
        { dueAt }
    )).data;


export const addOtherItem = async (
    invoiceId: number,
    dto: {
        description: string;
        quantity: number;
        unitName: string;
        pricePerUnit: number;
    }
) =>
    (await api.post<InvoiceDetail>(
        `/api/invoice/${invoiceId}/items/other`,
        dto
    )).data;

export const updateOtherItem = async (
    invoiceId: number,
    itemId: number,
    dto: {
        description: string;
        quantity: number;
        unitName: string;
        pricePerUnit: number;
    }
) =>
    (await api.patch<InvoiceDetail>(
        `/api/invoice/${invoiceId}/items/other/${itemId}`,
        dto
    )).data;

export const deleteOtherItem = async (
    invoiceId: number,
    itemId: number
) => api.delete(`/api/invoice/${invoiceId}/items/other/${itemId}`);