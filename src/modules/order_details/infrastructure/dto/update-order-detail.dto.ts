import { IsNotEmpty, IsNumber } from 'class-validator';
import { UpdateOrderDetailType } from '../../domain';

export class UpdateOrderDetailDto implements UpdateOrderDetailType {
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
