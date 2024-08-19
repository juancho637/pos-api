import { OrderType } from './order.type';

export type UpdateOrderRepositoryType = Omit<
  Partial<OrderType>,
  | 'id'
  | 'fee'
  | 'subtotalPrice'
  | 'totalPrice'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;
