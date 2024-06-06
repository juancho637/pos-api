import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';
import { CreateCustomerType } from '../../domain';

export class UpdateCustomerDto implements CreateCustomerType {
  @IsOptional()
  @IsString()
  type_identification: string;

  @IsOptional()
  @IsString()
  identification: string;

  @IsOptional()
  @IsString()
  full_name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
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
