import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { EmployeeAvailabilityStatus } from '../../types/employee/employee';
import {
    EMPLOYEE_AVAILABILITY_COLORS,
    EMPLOYEE_AVAILABILITY_LABELS,
} from '../../utils/employeeLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    status: EmployeeAvailabilityStatus;
};

export default function EmployeeAvailabilityBadge({ status, ...props }: Props) {
    return (
        <Badge colorClassName={EMPLOYEE_AVAILABILITY_COLORS[status]} {...props}>
            {EMPLOYEE_AVAILABILITY_LABELS[status]}
        </Badge>
    );
}
