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
  UpdateProductType,
  CreateProductType,
  productErrorsCodes,
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

  async findOneBy(fields: ProductFilterType): Promise<ProductEntity> {
    try {
      const product = await this.productsRepository.findOneOrFail({
        where: { ...fields },
        relations: ['category'],
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

  async store(createProductFields: CreateProductType): Promise<ProductEntity> {
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
    updateProductFields: UpdateProductType,
  ): Promise<ProductEntity> {
    try {
      const product = await this.findOneBy({ id });

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
      const product = await this.findOneBy({ id });

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
