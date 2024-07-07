import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateProductType } from '../../domain';

export class UpdateProductDto implements UpdateProductType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  category: number;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  min_stock: number;
}
