import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { ProductStockType } from './product-stock.type';
import { ProductStockFilterType } from './product-stock-filter.type';
import { CreateProductStockRepositoryType } from './create-product-stock-repository.type';
import { UpdateProductStockRepositoryType } from './update-product-stock-repository.type';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export interface ProductStockRepositoryInterface<
  Entity extends ProductStockType = ProductStockType,
> {
  findOneBy(
    findOneByFieldsDto: FindOneByFieldsDto<ProductStockType>,
  ): Promise<Entity>;
  findAll(
    findAllFieldsDto: FindAllFieldsDto<ProductStockFilterType>,
  ): Promise<PaginatedResourceType<Partial<Entity>>>;
  store(
    createProductStockFields: CreateProductStockRepositoryType,
  ): Promise<Entity>;
  update(
    id: number,
    updateProductFields: UpdateProductStockRepositoryType,
  ): Promise<Entity>;
  delete(id: number): Promise<Entity>;
}
