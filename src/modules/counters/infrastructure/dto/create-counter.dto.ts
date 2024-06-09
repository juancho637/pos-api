import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCounterType } from '../../domain';

export class CreateCounterDto implements CreateCounterType {
  @IsNotEmpty()
  @IsNumber()
  branch_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  base: number;

  @IsNotEmpty()
  @IsBoolean()
  status: string;
}
