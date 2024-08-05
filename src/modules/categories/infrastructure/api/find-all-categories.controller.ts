import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  CategoryFilterType,
  CategoryProvidersEnum,
  CategoryType,
  categoryErrorsCodes,
} from '../../domain';
import { FindAllCategoriesUseCase } from '../../application';
import { CategoryPresenter } from '../category.presenter';

@Controller()
export class FindAllCategoriesController {
  private readonly context = FindAllCategoriesController.name;

  constructor(
    @Inject(CategoryProvidersEnum.FIND_ALL_CATEGORIES_USE_CASE)
    private readonly findAllCategoriesUseCase: FindAllCategoriesUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/categories')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams<CategoryFilterType>('id', 'name', 'status')
    sortParams?: SortingType<CategoryFilterType>,
    @FilteringParams<CategoryFilterType>('id', 'name', 'status')
    filterParams?: FilteringType<CategoryFilterType>[],
  ): Promise<PaginatedResourceType<Partial<CategoryType>>> {
    try {
      const categories = await this.findAllCategoriesUseCase.run({
        pagination: paginationParams,
        sort: sortParams,
        filters: filterParams,
      });

      return {
        ...categories,
        items: categories.items.map(
          (category) => new CategoryPresenter(category),
        ),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM022,
        context: this.context,
        error,
      });
    }
  }
}
