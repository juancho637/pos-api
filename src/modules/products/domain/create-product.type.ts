import { ProductType } from './product.type';

export type CreateProductType = Omit<
  ProductType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'status'
>;
