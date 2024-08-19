import { OrderType } from './order.type';

export type CreateOrderType = Omit<
  OrderType,
  | 'id'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'counter'
  | 'customer'
> & {
  counterId: number;
  customerId?: number;
};
