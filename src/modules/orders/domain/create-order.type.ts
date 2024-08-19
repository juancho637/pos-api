import { OrderType } from './order.type';

export type CreateOrderType = Omit<
  OrderType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'counter' | 'customer'
> & {
  counterId: number;
  customerId?: number;
};
