import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getOrderTypeOrmHelper,
  getWhereTypeOrmHelper,
} from '@common/helpers/infrastructure';
import {
  FilterRuleEnum,
  FindOneByFieldsDto,
  FindAllFieldsDto,
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
  categoryErrorsCodes,
} from '../../domain';
import { CategoryEntity } from './category.entity';
import { CreateCategoryRepositoryType } from '@modules/categories/domain/create-category-repository.type';

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

  async findOneBy({
    filter,
    relations,
  }: FindOneByFieldsDto<CategoryFilterType>): Promise<CategoryEntity> {
    try {
      const where = getWhereTypeOrmHelper<CategoryFilterType>(filter);

      const category = await this.categoriesRepository.findOneOrFail({
        where,
        relations: relations || [],
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

  async findAll({
    pagination,
    sort,
    filters,
    relations,
  }: FindAllFieldsDto<CategoryFilterType>): Promise<
    PaginatedResourceType<Partial<CategoryEntity>>
  > {
    try {
      const { page, size } = pagination;
      const where = getWhereTypeOrmHelper(filters);
      const order = getOrderTypeOrmHelper(sort);

      const [categories, count] = await this.categoriesRepository.findAndCount({
        where,
        order,
        skip: (page - 1) * size,
        take: size,
        relations: relations || [],
      });

      const lastPage = Math.ceil(count / size);

      return {
        total: count,
        currentPage: page,
        lastPage: lastPage,
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
    createCategoryFields: CreateCategoryRepositoryType,
  ): Promise<CategoryEntity | CategoryEntity[]> {
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
      const category = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

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
      const category = await this.findOneBy({
        filter: { property: 'id', rule: FilterRuleEnum.EQUALS, value: id },
      });

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
