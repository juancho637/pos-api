import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsDate,
} from 'class-validator';
import { CreateCustomerType } from '../../domain';
import { Expose } from 'class-transformer';

export class CreateCustomerDto implements CreateCustomerType {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'type_identification' })
  typeIdentification: string;

  @IsNotEmpty()
  @IsString()
  identification: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'full_name' })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('CO') // Puede especificar un código de región, como 'US'
  phone?: string;

  @IsNotEmpty()
  @IsPhoneNumber('CO')
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
