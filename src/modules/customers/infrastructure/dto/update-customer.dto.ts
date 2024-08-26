import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';
import { CreateCustomerType } from '../../domain';
import { Expose } from 'class-transformer';

export class UpdateCustomerDto implements CreateCustomerType {
  @IsOptional()
  @IsString()
  @Expose({ name: 'type_identification' })
  typeIdentification: string;

  @IsOptional()
  @IsString()
  identification: string;

  @IsOptional()
  @IsString()
  @Expose({ name: 'full_name' })
  fullName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  @Expose({ name: 'cell_phone' })
  cellPhone: string;

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
