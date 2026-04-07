// utils/mappers/probabilityMapper.ts

import { toProbability, type Probability } from '../../types/common/valueObjects';

export function mapProbability(value: number): Probability {
    return toProbability(value);
}