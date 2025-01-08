import { CategoryPresenter } from '@modules/categories/infrastructure';
//import { ProductType } from '../domain';'@modules/categories/infrastructure';
import { ProductType } from '../domain';

export class ProductPresenter {
  id: number;
  name: string;
  category: CategoryPresenter;
  fee: number;
  description: string;
  type: string;
  min_stock: number;
  created_at: Date;
  updated_at: Date;

  constructor(product: Partial<ProductType>) {
    this.id = product.id;
    this.name = product.name;
    this.category = new CategoryPresenter(product.category);
    //this.category = product.category;
    this.fee = product.fee;
    this.description = product.description;
    this.type = product.type;
    this.min_stock = product.minStock;
    this.created_at = product.createdAt;
    this.updated_at = product.updatedAt;
  }
}
