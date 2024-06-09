import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateCounterType } from '../../domain';

export class UpdateCounterDto implements UpdateCounterType {
  @IsNotEmpty()
  @IsNumber()
  branch_id?: number;

  @IsNotEmpty()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsNumber()
  base?: number;
}
