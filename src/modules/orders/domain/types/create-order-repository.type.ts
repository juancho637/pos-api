import { OrderType } from './order.type';

export type CreateOrderRepositoryType = Omit<
  OrderType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
