import { CategoryPresenter } from '@modules/categories/infrastructure';
//import { ProductType } from '../domain';'@modules/categories/infrastructure';
import { ProductEntity } from './persistence';
import { CategoryType } from '@modules/categories/domain';

export class ProductPresenter {
  id: number;
  name: string;
  category: CategoryType;
  //category: CategoryPresenter;
  fee: number;
  description: string;
  type: string;
  min_stock: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(product: Partial<ProductEntity>) {
    this.id = product.id;
    this.name = product.name;
    this.category = new CategoryPresenter(product.category);
    //this.category = product.category;
    this.fee = product.fee;
    this.description = product.description;
    this.type = product.type;
    this.min_stock = product.min_stock;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
