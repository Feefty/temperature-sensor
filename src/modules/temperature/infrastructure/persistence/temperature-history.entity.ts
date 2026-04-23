import { AutoMap } from 'automapper-classes';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TemperatureState } from '../../domain/temperature-state.enum';

@Entity('temperature_history')
@Index('IDX_temperature_history_captured_at', ['capturedAt'])
export class TemperatureHistoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public rowId: string;


  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  public celsius: string;

  @AutoMap()
  @Column({ type: 'enum', enum: TemperatureState })
  public state: TemperatureState;

  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  public snapshotColdBelow: string;

  @AutoMap()
  @Column({ type: 'decimal', precision: 6, scale: 2 })
  public snapshotHotFrom: string;
  
  @AutoMap()
  @Column({ type: 'datetime', precision: 6 })
  public capturedAt: Date;
}
