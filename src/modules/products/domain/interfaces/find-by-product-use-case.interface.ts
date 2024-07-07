import { ProductFilterType } from '../product-filter.type';
import { ProductType } from '../product.type';

export interface FindByProductUseCaseInterface<
  Entity extends ProductType = ProductType,
> {
  run(productFilters: ProductFilterType): Promise<Entity>;
}
