import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';

export class ConfigDatabaseModel {
  @IsDefined()
  @IsString()
  public host: string;

  @IsDefined()
  @IsNumber()
  public port: number;

  @IsDefined()
  @IsString()
  public database: string;

  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsString()
  public password: string;

  @IsDefined()
  @IsBoolean()
  public synchronize: boolean;

  @IsDefined()
  @IsBoolean()
  public logging: boolean;

  @IsDefined()
  @IsBoolean()
  public migrationsRun: boolean;
}
