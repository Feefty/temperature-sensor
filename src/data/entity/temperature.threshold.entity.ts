import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class TemperatureThreshold extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    coldToWarm: number

    @Column()
    warmToHot: number

}