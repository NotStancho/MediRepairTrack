import { useCallback, useEffect, useState } from 'react';
import type { InvoiceFull, InvoiceOtherItemPayload } from '../types/invoice';
import {
    getInvoiceFullByClaim,
    createInvoiceDraft,
    issueInvoice,
    recalcInvoice,
    addOtherItem,
    updateOtherItem,
    deleteOtherItem,
    updateInvoiceDueDate
} from '../api/invoice';

export function useInvoice(claimId: number) {
    const [invoice, setInvoice] = useState<InvoiceFull | null>(null);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async (cancelled?: () => boolean) => {
        if (cancelled?.()) return;

        setLoading(true);
        try {
            const full = await getInvoiceFullByClaim(claimId);

            if (!cancelled?.()) {
                setInvoice(full);
            }
        } catch {
            if (!cancelled?.()) {
                setInvoice(null);
            }
        } finally {
            if (!cancelled?.()) {
                setLoading(false);
            }
        }
    }, [claimId]);

    useEffect(() => {
        let cancelled = false;

        void reload(() => cancelled);

        return () => {
            cancelled = true;
        };
    }, [reload]);

    /* ======================
       BASIC ACTIONS
       ====================== */

    const createDraft = async () => {
        await createInvoiceDraft(claimId);
        await reload();
    };

    const recalc = async () => {
        if (!invoice) return;
        await recalcInvoice(invoice.id);
        await reload();
    };

    const issue = async () => {
        if (!invoice) return;
        await issueInvoice(invoice.id);
        await reload();
    };

    /* ======================
       OTHER ITEMS
       ====================== */

    const updateDueDate = async (dueAt: string) => {
        if (!invoice) return;
        await updateInvoiceDueDate(invoice.id, dueAt);
        await reload();
    };

    const addOther = async (dto: InvoiceOtherItemPayload) => {
        if (!invoice) return;
        await addOtherItem(invoice.id, dto);
        await reload();
    };

    const updateOther = async (
        itemId: number,
        dto: InvoiceOtherItemPayload
    ) => {
        if (!invoice) return;
        await updateOtherItem(invoice.id, itemId, dto);
        await reload();
    };

    const removeOther = async (itemId: number) => {
        if (!invoice) return;
        await deleteOtherItem(invoice.id, itemId);
        await reload();
    };

    return {
        invoice,
        loading,

        reload,

        createDraft,
        recalc,
        issue,

        updateDueDate,
        addOther,
        updateOther,
        removeOther,
    };
}
