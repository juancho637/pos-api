import { OrderType } from './order.type';

export type OrderFilterType = Omit<
  Partial<OrderType>,
  'fee' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'counter' | 'customer'
>;
