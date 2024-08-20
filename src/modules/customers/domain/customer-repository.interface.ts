import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { CustomerType } from './customer.type';
import { UpdateCustomerType } from './update-customer.type';
import { CustomerFilterType } from './customer-filter.type';
import { CreateCustomerRepositoryType } from './types';

export interface CustomerRepositoryInterface<
  Entity extends CustomerType = CustomerType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<CustomerFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<CustomerFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createCustomerFields:
      | CreateCustomerRepositoryType
      | CreateCustomerRepositoryType[],
  ): Promise<Entity | Entity[]>;
  update(id: number, updateCustomerFields: UpdateCustomerType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
