import { OrderDetailType } from '../order-detail.type';

export type CreateOrderDetailRepositoryType = Omit<
  OrderDetailType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
