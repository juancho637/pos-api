import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { CustomerType } from './customer.type';
import { CreateCustomerType } from './create-customer.type';
// import { UpdateCustomerType } from './update-customer.type';
import { CustomerFilterType } from './customer-filter.type';

export interface CustomerRepositoryInterface<
  Entity extends CustomerType = CustomerType,
> {
  findOneBy(fields: CustomerFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createCustomerFields: CreateCustomerType): Promise<Entity>;
  // update(id: number, updateCustomerFields: UpdateCustomerType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
