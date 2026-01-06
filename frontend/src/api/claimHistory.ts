import { api } from './api';
import type { ClaimHistory } from '../types/claimHistory';

export const getClaimHistory = async (claimId: number) =>
    (await api.get<ClaimHistory[]>(
        `/api/claims/${claimId}/history`
    )).data;
