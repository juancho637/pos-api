import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryType } from '../../domain';

export class CreateCategoryDto implements CreateCategoryType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
