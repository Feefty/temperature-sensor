import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ConfigServerModel } from './config-server.model';
import { ConfigDatabaseModel } from './config-database.model';
import { ConfigSensorModel } from './config-sensor.model';

export class ConfigModel {
  @IsDefined()
  @ValidateNested()
  @Type(() => ConfigServerModel)
  public server: ConfigServerModel;

  @IsDefined()
  @ValidateNested()
  @Type(() => ConfigDatabaseModel)
  public database: ConfigDatabaseModel;

  @IsDefined()
  @ValidateNested()
  @Type(() => ConfigSensorModel)
  public sensor: ConfigSensorModel;
}
