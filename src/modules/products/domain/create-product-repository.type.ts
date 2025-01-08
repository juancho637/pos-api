import { ProductType } from './product.type';

export type CreateProductRepositoryType = Omit<
  ProductType,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
