import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCounterType } from '../../domain';

export class CreateCounterDto implements CreateCounterType {
  status: string;
  userId: number;
  startTime: Date;
  endTime: Date;

  @IsNotEmpty()
  @IsNumber()
  base: number;
}
