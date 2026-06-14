import { Threshold } from '../../models/threshold.model';

export interface UpdateThresholdsPort {
  execute(coldMax: number, hotMin: number): Promise<Threshold>;
}
