import type { SensorState } from '@/types';

export const STATE_LABEL: Record<SensorState, string> = {
  COLD: 'Cold',
  WARM: 'Warm',
  HOT: 'Hot',
};
