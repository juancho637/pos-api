import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  PaginatedResourceType,
  FindAllFieldsDto,
  FindOneByFieldsDto,
  FilterRuleEnum,
} from '@common/helpers/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  ProductStockRepositoryInterface,
  ProductStockFilterType,
  productStockErrorsCodes,
  CreateProductStockRepositoryType,
  UpdateProductStockRepositoryType,
} from '../../domain';
import { ProductStockEntity } from './product-stock.entity';

export class ProductStockTypeOrmRepository
  implements ProductStockRepositoryInterface<ProductStockEntity>
{
  private readonly context = ProductStockTypeOrmRepository.name;

  constructor(
    @InjectRepository(ProductStockEntity)
    private readonly productStocksRepository: Repository<ProductStockEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<ProductStockFilterType>): Promise<ProductStockEntity> {
    try {
      const where = getWhereTypeOrmHelper<ProductStockFilterType>(filter);
      const productStock = await this.productStocksRepository.findOneOrFail({
        where,
        relations: relations,
      });
      return productStock;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<ProductStockFilterType>): Promise<
    PaginatedResourceType<Partial<ProductStockEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [productStockStocks, count] =
        await this.productStocksRepository.findAndCount({
          where,
          order,
          skip: (page - 1) * size,
          take: size,
        });

      const lastPage = Math.ceil(count / size);

      return {
        total: count,
        current_page: page,
        last_page: lastPage,
        size,
        items: productStockStocks,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createProductStockFields: CreateProductStockRepositoryType,
  ): Promise<ProductStockEntity> {
    try {
      return this.productStocksRepository.save(createProductStockFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateProductStockFields: UpdateProductStockRepositoryType,
  ): Promise<ProductStockEntity> {
    try {
      const productStock = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.productStocksRepository.save({
        ...productStock,
        ...updateProductStockFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<ProductStockEntity> {
    try {
      const productStock = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.productStocksRepository.softRemove(productStock);

      return { ...productStock, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM050,
        context: this.context,
        error,
      });
    }
  }
}
