import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { ProductType } from './product.type';
import { CreateProductType } from './create-product.type';
import { UpdateProductType } from './update-product.type';
import { ProductFilterType } from './product-filter.type';

export interface ProductRepositoryInterface<
  Entity extends ProductType = ProductType,
> {
  findOneBy(fields: ProductFilterType): Promise<Entity>;
  findAll(
    pagination: PaginationType,
    sort: SortingType,
    filters: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createProductFields: CreateProductType): Promise<Entity>;
  update(id: number, updateProductFields: UpdateProductType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
