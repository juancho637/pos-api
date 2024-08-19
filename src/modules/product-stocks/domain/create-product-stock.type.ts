import { ProductStockType } from './product-stock.type';

export type CreateProductStockType = Omit<
  ProductStockType,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'status'
  | 'product'
  | 'provider'
> & {
  productId: number;
  providerId: number;
};
