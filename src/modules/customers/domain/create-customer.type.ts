import { CustomerType } from './customer.type';

export type CreateCustomerType = Omit<
  CustomerType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;
