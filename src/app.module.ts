import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TemperatureSensorModule } from './temperature-sensor/temperature-sensor.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            driver: ApolloDriver,
        }),
        TemperatureSensorModule,
    ],
})
export class AppModule {}
