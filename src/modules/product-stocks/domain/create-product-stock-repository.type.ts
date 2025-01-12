import { ProductStockType } from './product-stock.type';

export type CreateProductStockRepositoryType = Omit<
  ProductStockType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;
