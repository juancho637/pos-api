import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOrderType } from '../../../domain';

export class CreateOrderDto implements CreateOrderType {
  @IsNotEmpty()
  @IsString()
  type: string;

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
