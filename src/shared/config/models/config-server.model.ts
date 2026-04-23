import { IsNumber, IsString, IsDefined } from 'class-validator';

export class ConfigServerModel {
  @IsDefined()
  @IsNumber()
  public port: number;

  @IsDefined()
  @IsString()
  public hostname: string;

  @IsDefined()
  @IsString()
  public globalPrefix: string;
}
