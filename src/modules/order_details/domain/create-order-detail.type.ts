import { OrderDetailType } from './order-detail.type';

export type CreateOrderDetailType = Omit<
  OrderDetailType,
  | 'id'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'productStock'
  | 'order'
> & {
  productStockId: number;
  orderId: number;
};
