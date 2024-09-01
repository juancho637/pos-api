import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderType, OrderTypeEnum } from '../../../domain';

export class CreateOrderDto implements CreateOrderType {
  @IsNotEmpty()
  @IsEnum(OrderTypeEnum)
  type: OrderTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  subtotalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  counterId: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;
}
