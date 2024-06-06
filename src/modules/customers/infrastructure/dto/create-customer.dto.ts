import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';
import { CreateCustomerType } from '../../domain';

export class CreateCustomerDto implements CreateCustomerType {
  @IsNotEmpty()
  @IsString()
  type_identification: string;

  @IsNotEmpty()
  @IsString()
  identification: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber(null) // Puede especificar un código de región, como 'US'
  phone?: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  cell_phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @IsOptional()
  @IsString()
  gender?: string;
}
