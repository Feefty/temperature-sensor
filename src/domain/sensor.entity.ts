import { Field, ObjectType } from '@nestjs/graphql'

type SensorState = 'HOT' | 'COLD' | 'WARM'

@ObjectType()
export class Sensor {
    @Field()
    id: string

    @Field()
    state: SensorState

    constructor(id: string, state: SensorState) {
        this.id = id
        this.state = state
    }
}
