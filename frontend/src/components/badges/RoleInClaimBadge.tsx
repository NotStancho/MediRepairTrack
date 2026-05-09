import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { RoleInClaim } from '../../types/claim/assignedClaim';
import { ROLE_IN_CLAIM_COLORS, ROLE_IN_CLAIM_LABELS } from '../../utils/roleInClaimLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    role: RoleInClaim;
};

export default function RoleInClaimBadge({ role, ...props }: Props) {
    return (
        <Badge colorClassName={ROLE_IN_CLAIM_COLORS[role]} {...props}>
            {ROLE_IN_CLAIM_LABELS[role]}
        </Badge>
    );
}
