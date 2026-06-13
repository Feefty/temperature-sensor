import { Module } from '@nestjs/common';

import { TemperatureModule } from './temperature/temperature.module';

@Module({ imports: [TemperatureModule] })
export class AppModule {}
