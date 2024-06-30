import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity()
export class Record extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    temperature: number

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}