import { CustomerFilterType } from '../customer-filter.type';
import { CustomerType } from '../customer.type';

export interface FindByCustomerUseCaseInterface<
  Entity extends CustomerType = CustomerType,
> {
  run(customerFilters: CustomerFilterType): Promise<Entity>;
}
