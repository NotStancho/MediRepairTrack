import type { Claim } from '../../types/claim/claim';
import type {EquipmentFull} from "../../types/equipment/equipmentFull";
import {CLAIM_STATUS_LABELS, REPAIR_TYPE_LABELS, STATUS_COLORS, REPAIR_TYPE_COLORS } from '../../utils/claimLabels';

interface Props {
    claim: Claim;
    equipment?: EquipmentFull | null;
}

export default function ClaimHeader({ claim, equipment }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            {/* Ліва частина */}
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
                        REPAIR_TYPE_COLORS?.[claim.repairType] ?? 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {REPAIR_TYPE_LABELS[claim.repairType]}
                </span>
            </div>

            {/* 🧰 Обладнання */}
            {equipment && (
                <div className="text-sm text-gray-600">
                    {equipment.modelName}
                    <span className="mx-2 text-gray-400">•</span>
                    SN: <span className="font-mono">{equipment.serialNumber}</span>
                </div>
            )}

            {/* Права частина */}
            <div className="text-sm text-gray-700 whitespace-nowrap">
                ⏱ {claim.totalTimeSpent ?? 0} год
            </div>
        </div>
    );
}
