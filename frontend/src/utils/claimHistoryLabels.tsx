import {
    HiOutlineClock,
    HiOutlineChatBubbleLeft,
    HiOutlineCog6Tooth,
    HiOutlineArrowPath,
    HiOutlineWrenchScrewdriver,
    HiOutlineTruck,
} from 'react-icons/hi2';

import type { ReactNode } from 'react';
import type { ClaimHistoryActionType } from '../types/claim/claimHistory';

export const HISTORY_ICONS: Record<
    ClaimHistoryActionType,
    {
        icon: ReactNode;
        color: string;
        label: string;
    }
> = {
    STATUS_CHANGE: {
        icon: <HiOutlineArrowPath />,
        color: 'bg-brand',
        label: 'Зміна статусу',
    },
    WORK_LOG: {
        icon: <HiOutlineClock />,
        color: 'bg-emerald-600',
        label: 'Робочий час',
    },
    COMMENT: {
        icon: <HiOutlineChatBubbleLeft />,
        color: 'bg-slate-600',
        label: 'Коментар',
    },
    SYSTEM_EVENT: {
        icon: <HiOutlineCog6Tooth />,
        color: 'bg-ink-muted',
        label: 'Системна подія',
    },
    PART_USED: {
        icon: <HiOutlineWrenchScrewdriver  />,
        color: 'bg-indigo-600',
        label: 'Операції з запчастинами',
    },
    DELIVERY_EVENT: {
        icon: <HiOutlineTruck />,
        color: 'bg-orange-600',
        label: 'Доставка',
    },
};
