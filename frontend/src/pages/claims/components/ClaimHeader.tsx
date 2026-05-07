// pages/claims/components/ClaimHeader.tsx

import type { Claim } from '../../../types/claim/claim';
import type { EquipmentFull } from "../../../types/equipment/equipmentFull";
import { CLAIM_STATUS_LABELS, REPAIR_TYPE_LABELS, STATUS_COLORS, REPAIR_TYPE_COLORS } from '../../../utils/claimLabels';
import { FiClock } from "react-icons/fi";
import * as React from "react";

interface Props {
    claim: Claim;
    equipment?: EquipmentFull | null;
    actions?: React.ReactNode;
}

export default function ClaimHeader({ claim, equipment, actions }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
            {/* LEFT SIDE */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="text-lg font-bold">
                    Заявка #{claim.id}
                </span>

                <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[claim.status]}`}
                >
                    {CLAIM_STATUS_LABELS[claim.status]}
                </span>

                <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                        REPAIR_TYPE_COLORS?.[claim.repairType] ?? 'bg-surface-muted text-ink-muted'
                    }`}
                >
                    {REPAIR_TYPE_LABELS[claim.repairType]}
                </span>
            </div>

            {/* Equipment */}
            {equipment && (
                <div className="text-sm text-ink-muted">
                    {equipment.modelName}
                    <span className="mx-2 text-ink-soft">•</span>
                    SN: <span className="font-mono">{equipment.serialNumber}</span>
                </div>
            )}

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
                {actions}
                <div className="text-sm text-ink flex whitespace-nowrap items-center gap-1">
                    <FiClock />
                    {claim.totalTimeSpent ?? 0} год
                </div>
            </div>
        </div>
    );
}
