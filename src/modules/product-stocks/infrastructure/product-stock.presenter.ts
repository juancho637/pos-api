import { ProductPresenter } from '@modules/products/infrastructure';
import { ProviderPresenter } from '@modules/providers/infrastructure';
import { ProductStockType } from '../domain';

export class ProductStockPresenter {
  id: number;
  product: ProductPresenter;
  provider: ProviderPresenter;
  code: string;
  sku: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;

  constructor(productStock: Partial<ProductStockType>) {
    this.id = productStock.id;
    this.product = new ProductPresenter(productStock.product);
    this.provider = new ProviderPresenter(productStock.provider);
    this.code = productStock.code;
    this.sku = productStock.sku;
    this.quantity = productStock.quantity;
    this.created_at = productStock.createdAt;
    this.updated_at = productStock.updatedAt;
  }
}
