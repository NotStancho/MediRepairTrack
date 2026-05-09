// pages/claims/tabs/ClaimDiagnosisTab/DiagnosisStatusActions.tsx

import { useMemo } from 'react';
import type { Diagnosis, DiagnosisStatus } from '../../../../types/diagnosis/diagnosis';
import {
    DIAGNOSIS_STATUS_LABELS,
    DIAGNOSIS_STATUS_ACTION_LABELS
} from '../../../../utils/diagnosisLabels';

import RowActionsMenu from '../../../../ui/RowActionsMenu';
import DiagnosisStatusBadge from '../../../../components/badges/DiagnosisStatusBadge';

interface Props {
    diagnosis: Diagnosis;
    allowedStatuses: DiagnosisStatus[];
    allowedStatusesLoading: boolean;

    confirming: boolean;
    rejecting: boolean;
    archiving: boolean;

    onConfirm: () => Promise<void>;
    onReject: () => Promise<void>;
    onArchive: () => Promise<void>;
}

export default function DiagnosisStatusActions({
                                                   diagnosis,
                                                   allowedStatuses, allowedStatusesLoading,
                                                   confirming, rejecting, archiving,
                                                   onConfirm, onReject, onArchive,
                                               }: Props) {

    const hasActions = allowedStatuses.length > 0;
    const busy = confirming || rejecting || archiving;

    const actions = useMemo(() => {
        const statusActionHandlers: Partial<Record<DiagnosisStatus, () => Promise<void>>> = {
            CONFIRMED: onConfirm,
            REJECTED: onReject,
            ARCHIVED: onArchive,
        };

        return allowedStatuses.flatMap((status) => {
            const handler = statusActionHandlers[status];
            const label = DIAGNOSIS_STATUS_ACTION_LABELS[status];

            if (!handler || !label) return [];

            return [{
                label,
                onClick: handler,
                danger: status === 'REJECTED',
            }];
        });
    }, [allowedStatuses, onConfirm, onReject, onArchive]);

    return (
        <RowActionsMenu
            actions={actions}
            disabled={allowedStatusesLoading || busy || !hasActions}
            trigger={
                <DiagnosisStatusBadge
                    status={diagnosis.status}
                    shape="rounded"
                    className={`
                        gap-2
                        ${hasActions ? 'cursor-pointer hover:opacity-90' : ''}
                        ${(allowedStatusesLoading || busy) ? 'opacity-70' : ''}
                    `}
                >
                    {DIAGNOSIS_STATUS_LABELS[diagnosis.status]}

                    {allowedStatusesLoading ? (
                        <span className="text-[10px]">…</span>
                    ) : hasActions ? (
                        <span className="text-[10px]">▾</span>
                    ) : null}
                </DiagnosisStatusBadge>
            }
        />
    );
}
