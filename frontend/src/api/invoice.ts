import { api } from './api';
import type {
    Invoice,
    InvoiceDetail,
    InvoiceFull,
    InvoiceOtherItemPayload,
} from '../types/invoice';

export const getAllInvoices = async () =>
    (await api.get<Invoice[]>('/api/invoice')).data;

export const getInvoicesByClient = async (clientId: number) =>
    (await api.get<Invoice[]>(`/api/invoice/client/${clientId}`)).data;

export const getInvoiceById = async (invoiceId: number) =>
    (await api.get<Invoice>(`/api/invoice/${invoiceId}`)).data;

export const getInvoiceFullById = async (invoiceId: number) =>
    (await api.get<InvoiceFull>(`/api/invoice/${invoiceId}/full`)).data;

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
    dueAt: string // ISO local date-time string
) =>
    (await api.patch(
        `/api/invoice/${invoiceId}/due-date`,
        { dueAt }
    )).data;


export const addOtherItem = async (
    invoiceId: number,
    dto: InvoiceOtherItemPayload
) =>
    (await api.post<InvoiceDetail>(
        `/api/invoice/${invoiceId}/items/other`,
        dto
    )).data;

export const updateOtherItem = async (
    invoiceId: number,
    itemId: number,
    dto: InvoiceOtherItemPayload
) =>
    (await api.patch<InvoiceDetail>(
        `/api/invoice/${invoiceId}/items/other/${itemId}`,
        dto
    )).data;

export const deleteOtherItem = async (
    invoiceId: number,
    itemId: number
) => api.delete(`/api/invoice/${invoiceId}/items/other/${itemId}`);
