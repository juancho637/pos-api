import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateProductStockType } from '../../domain';

export class UpdateProductStockDto implements UpdateProductStockType {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  providerId: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
