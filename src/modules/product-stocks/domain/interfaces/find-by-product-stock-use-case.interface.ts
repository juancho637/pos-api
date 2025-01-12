import { ProductStockFilterType } from '../product-stock-filter.type';
import { ProductStockType } from '../product-stock.type';

export interface FindByProductStockUseCaseInterface<
  Entity extends ProductStockType = ProductStockType,
> {
  run(productStockFilters: ProductStockFilterType): Promise<Entity>;
}
