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
  ProductRepositoryInterface,
  ProductFilterType,
  productErrorsCodes,
  CreateProductRepositoryType,
  UpdateProductRepositoryType,
} from '../../domain';
import { ProductEntity } from './product.entity';

export class ProductTypeOrmRepository
  implements ProductRepositoryInterface<ProductEntity>
{
  private readonly context = ProductTypeOrmRepository.name;

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy({
    filter,
    relations = [],
  }: FindOneByFieldsDto<ProductFilterType>): Promise<ProductEntity> {
    try {
      const where = getWhereTypeOrmHelper<ProductFilterType>(filter);

      const product = await this.productsRepository.findOneOrFail({
        where,
        relations: relations || [],
      });
      return product;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<ProductFilterType>): Promise<
    PaginatedResourceType<Partial<ProductEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [products, count] = await this.productsRepository.findAndCount({
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
        items: products,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createProductFields: CreateProductRepositoryType,
  ): Promise<ProductEntity> {
    try {
      return this.productsRepository.save(createProductFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateProductFields: UpdateProductRepositoryType,
  ): Promise<ProductEntity> {
    try {
      const product = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      return await this.productsRepository.save({
        ...product,
        ...updateProductFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<ProductEntity> {
    try {
      const product = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

      await this.productsRepository.softRemove(product);

      return { ...product, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM050,
        context: this.context,
        error,
      });
    }
  }
}
