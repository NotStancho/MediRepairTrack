// pages/claims/components/ClaimHeader.tsx

import type { Claim } from '../../../types/claim/claim';
import type { EquipmentFull } from "../../../types/equipment/equipmentFull";
import { FiClock } from "react-icons/fi";
import * as React from "react";
import ClaimStatusBadge from '../../../components/badges/ClaimStatusBadge';
import RepairTypeBadge from '../../../components/badges/RepairTypeBadge';

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

                <ClaimStatusBadge status={claim.status} shape="rounded" />

                <RepairTypeBadge type={claim.repairType} shape="rounded" />
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
