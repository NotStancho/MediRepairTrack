import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { DiagnosisType } from '../../types/diagnosis/diagnosis';
import { DIAGNOSIS_TYPE_COLORS, DIAGNOSIS_TYPE_LABELS } from '../../utils/diagnosisLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    type: DiagnosisType;
};

export default function DiagnosisTypeBadge({ type, ...props }: Props) {
    return (
        <Badge colorClassName={DIAGNOSIS_TYPE_COLORS[type]} {...props}>
            {DIAGNOSIS_TYPE_LABELS[type]}
        </Badge>
    );
}
