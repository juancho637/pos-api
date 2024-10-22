import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateOrderDetailType } from '../../domain';

export class CreateOrderDetailDto implements CreateOrderDetailType {
  @IsNotEmpty()
  @IsNumber()
  productStockId: number;

  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
