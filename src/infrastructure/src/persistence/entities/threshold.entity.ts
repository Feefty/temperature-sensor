import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('thresholds')
export class ThresholdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { name: 'cold_max', precision: 5, scale: 2 })
  coldMax: number;

  @Column('decimal', { name: 'hot_min', precision: 5, scale: 2 })
  hotMin: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
