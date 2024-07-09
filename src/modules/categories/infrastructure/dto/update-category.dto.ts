import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateCategoryType } from '../../domain';

export class UpdateCategoryDto implements UpdateCategoryType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
