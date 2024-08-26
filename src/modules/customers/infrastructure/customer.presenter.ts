import { CustomerType } from '../domain';

export class CustomerPresenter {
  id: number;
  status: string;
  type_identification: string;
  identification: string;
  full_name: string;
  email: string;
  phone: string;
  cell_phone: string;
  address: string;
  birthdate: Date;
  gender: string;
  created_at: Date;
  updated_at: Date;

  constructor(customer: Partial<CustomerType>) {
    this.id = customer.id;
    this.status = customer.status;
    this.type_identification = customer.typeIdentification;
    this.identification = customer.identification;
    this.full_name = customer.fullName;
    this.email = customer.email;
    this.phone = customer.phone;
    this.cell_phone = customer.cellPhone;
    this.address = customer.address;
    this.birthdate = customer.birthdate;
    this.gender = customer.gender;
    this.updated_at = customer.updatedAt;
    this.created_at = customer.createdAt;
  }
}
