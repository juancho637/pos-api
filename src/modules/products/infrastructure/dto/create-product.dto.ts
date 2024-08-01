import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateProductType } from '../../domain';

export class CreateProductDto implements CreateProductType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

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
