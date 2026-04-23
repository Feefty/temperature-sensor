import { AutoMap } from 'automapper-classes';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sensor_thresholds')
export class SensorThresholdsEntity {
  @PrimaryColumn({ type: 'tinyint', unsigned: true })
  public singletonKey: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  public coldBelowCelsius: string;

  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  public hotFromCelsius: string;

  @Column({ type: 'datetime', precision: 6 })
  public updatedAt: Date;
}
