import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { ProductType } from './product.type';
import { ProductFilterType } from './product-filter.type';
import { CreateProductRepositoryType } from './create-product-repository.type';
import { UpdateProductRepositoryType } from './update-product-repository.type';

export interface ProductRepositoryInterface<
  Entity extends ProductType = ProductType,
> {
  findOneBy(fields: ProductFilterType): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<ProductFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createProductFields: CreateProductRepositoryType): Promise<Entity>;
  update(
    id: number,
    updateProductFields: UpdateProductRepositoryType,
  ): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
