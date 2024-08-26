import { CustomerType } from '../customer.type';

export type CreateCustomerRepositoryType = Omit<
  CustomerType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
