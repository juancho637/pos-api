import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
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
  CategoryRepositoryInterface,
  CategoryFilterType,
  UpdateCategoryType,
  CreateCategoryType,
  categoryErrorsCodes,
} from '../../domain';
import { CategoryEntity } from './category.entity';

export class CategoryTypeOrmRepository
  implements CategoryRepositoryInterface<CategoryEntity>
{
  private readonly context = CategoryTypeOrmRepository.name;

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async findOneBy(fields: CategoryFilterType): Promise<CategoryEntity> {
    try {
      const category = await this.categoriesRepository.findOneOrFail({
        where: { ...fields },
      });

      return category;
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM010,
        context: this.context,
        error,
      });
    }
  }

  async findAll(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<CategoryEntity>>> {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [categories, count] = await this.categoriesRepository.findAndCount({
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
        items: categories,
      };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM020,
        context: this.context,
        error,
      });
    }
  }

  async store(
    createCategoryFields: CreateCategoryType,
  ): Promise<CategoryEntity> {
    try {
      return this.categoriesRepository.save(createCategoryFields);
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM030,
        context: this.context,
        error,
      });
    }
  }

  async update(
    id: number,
    updateCategoryFields: UpdateCategoryType,
  ): Promise<CategoryEntity> {
    try {
      const category = await this.findOneBy({ id });

      return await this.categoriesRepository.save({
        ...category,
        ...updateCategoryFields,
      });
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM040,
        context: this.context,
        error,
      });
    }
  }

  async delete(id: number): Promise<CategoryEntity> {
    try {
      const category = await this.findOneBy({ id });

      await this.categoriesRepository.softRemove(category);

      return { ...category, id };
    } catch (error) {
      this.logger.error({ message: error, context: this.context });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM050,
        context: this.context,
        error,
      });
    }
  }
}
