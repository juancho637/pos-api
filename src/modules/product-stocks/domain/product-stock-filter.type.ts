import { ProductType } from '@modules/products/domain';
import { ProviderType } from '@modules/providers/domain';

export type ProductStockFilterType = {
  id?: number;
  productId?: ProductType;
  providerId?: ProviderType;
  code?: string;
  sku?: string;
  quantity?: number;
  status?: string;
};
