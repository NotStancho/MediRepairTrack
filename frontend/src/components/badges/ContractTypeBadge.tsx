import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { ContractType } from '../../types/clientContract/contractType';
import { CONTRACT_TYPE_COLORS, getContractTypeLabel } from '../../utils/clientContractLabel';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: ContractType;
};

export default function ContractTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={CONTRACT_TYPE_COLORS[type]} {...props}>
            {getContractTypeLabel(type)}
        </Badge>
    );
}
