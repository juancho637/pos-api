import { ProductPresenter } from '@modules/products/infrastructure';
import { ProviderPresenter } from '@modules/providers/infrastructure';
//import { ProductType } from '../domain';'@modules/categories/infrastructure';
import { ProductStockEntity } from './persistence';
import { ProductType } from '@modules/products/domain';
import { ProviderType } from '@modules/providers/domain';

export class ProductStockPresenter {
  id: number;
  product: ProductType;
  provider: ProviderType;
  code: string;
  sku: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(productStock: Partial<ProductStockEntity>) {
    this.id = productStock.id;
    this.product = new ProductPresenter(productStock.product);
    this.provider = new ProviderPresenter(productStock.provider);
    this.code = productStock.code;
    this.sku = productStock.sku;
    this.quantity = productStock.quantity;
    this.createdAt = productStock.createdAt;
    this.updatedAt = productStock.updatedAt;
  }
}
