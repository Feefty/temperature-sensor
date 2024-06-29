import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Temperature {
    @Field()
    value: number

    @Field()
    timestamp: Date

    constructor(value: number) {
        this.value = value
        this.timestamp = new Date()
    }
}
