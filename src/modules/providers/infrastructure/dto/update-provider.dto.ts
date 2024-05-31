import { IsOptional, IsString } from 'class-validator';
import { UpdateProviderType } from '../../domain';

export class UpdateProviderDto implements UpdateProviderType {
  @IsOptional()
  @IsString()
  name?: string;
}