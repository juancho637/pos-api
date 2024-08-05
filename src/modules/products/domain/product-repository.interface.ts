import {
  FindAllFieldsDto,
  FindOneByFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { ProductType } from './product.type';
import { CreateProductType } from './create-product.type';
import { UpdateProductType } from './update-product.type';
import { ProductFilterType } from './product-filter.type';

export interface ProductRepositoryInterface<
  Entity extends ProductType = ProductType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<ProductFilterType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<ProductFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(createProductFields: CreateProductType): Promise<Entity>;
  update(id: number, updateProductFields: UpdateProductType): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
