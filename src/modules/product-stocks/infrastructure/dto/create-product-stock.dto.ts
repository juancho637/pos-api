import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateProductStockType } from '../../domain';

export class CreateProductStockDto implements CreateProductStockType {
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
