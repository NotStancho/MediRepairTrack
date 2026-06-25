import type { BadgeProps } from './Badge';
import Badge from './Badge';

import type { SimilaritySearchMode } from '../../types/diagnosis/DSS/similaritySearchMode';
import {
    SIMILARITY_SEARCH_MODE_COLORS,
    SIMILARITY_SEARCH_MODE_LABELS
} from '../../utils/similaritySearchModeLabels';

type Props = Omit<BadgeProps, 'children' | 'colorClassName'> & {
    mode: SimilaritySearchMode;
};

export default function SimilaritySearchModeBadge({ mode, ...props }: Props) {
    return (
        <Badge colorClassName={SIMILARITY_SEARCH_MODE_COLORS[mode]} {...props}>
            {SIMILARITY_SEARCH_MODE_LABELS[mode]}
        </Badge>
    );
}