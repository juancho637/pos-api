import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { CustomerType } from './customer.type';
import { CreateCustomerType } from './create-customer.type';
import { UpdateCustomerType } from './update-customer.type';
import { CustomerFilterType } from './customer-filter.type';

export interface CustomerRepositoryInterface<
  Entity extends CustomerType = CustomerType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<CustomerFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<CustomerFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createCustomerFields: CreateCustomerType): Promise<Entity>;
  update(id: number, updateCustomerFields: UpdateCustomerType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
