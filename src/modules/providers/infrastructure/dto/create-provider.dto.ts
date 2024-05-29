import { IsNotEmpty, IsString } from 'class-validator';
import { CreateProviderType } from '../../domain';

export class CreateProviderDto implements CreateProviderType {
  @IsNotEmpty()
  @IsString()
  name: string;
}
