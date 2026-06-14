import { Threshold } from '../../models/threshold.model';

export interface GetThresholdsPort {
  execute(): Promise<Threshold>;
}
