import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderTypeEnum, UpdateOrderType } from '../../../domain';

export class UpdateOrderDto implements UpdateOrderType {
  @IsOptional()
  @IsNumber()
  counterId: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsEnum(OrderTypeEnum)
  type?: OrderTypeEnum;
}
