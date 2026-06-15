import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('temperature_captures')
export class TemperatureCaptureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  value: number;

  @Column({ type: 'varchar', length: 10 })
  state: string;

  @CreateDateColumn({ name: 'captured_at', type: 'timestamp' })
  capturedAt: Date;
}
