import { OrderType } from './order.type';

export type UpdateOrderType = Omit<
  Partial<OrderType>,
  | 'id'
  | 'fee'
  | 'subtotalPrice'
  | 'totalPrice'
  | 'counter'
  | 'customer'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  counterId?: number;
  customerId?: number;
};
