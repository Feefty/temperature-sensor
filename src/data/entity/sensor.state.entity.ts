import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum SensorState {
    HOT = "HOT",
    WARM = "WARM",
    COLD = "COLD",
}

@Entity()
export class State extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: SensorState
    })
    State?: SensorState
}