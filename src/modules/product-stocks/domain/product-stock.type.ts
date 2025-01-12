import { ProductType } from '@modules/products/domain';
import { ProviderType } from '@modules/providers/domain';

export type ProductStockType = {
  id: number;
  product: ProductType;
  provider: ProviderType;
  code: string;
  sku: string;
  quantity: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  deletedAt?: Date;
};
