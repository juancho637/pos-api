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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(customer: Partial<CustomerType>) {
    this.id = customer.id;
    this.status = customer.status;
    this.type_identification = customer.type_identification;
    this.identification = customer.identification;
    this.full_name = customer.full_name;
    this.email = customer.email;
    this.phone = customer.phone;
    this.cell_phone = customer.cell_phone;
    this.address = customer.address;
    this.birthdate = customer.birthdate;
    this.gender = customer.gender;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
    this.deletedAt = customer.deletedAt;
  }
}
