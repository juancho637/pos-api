import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class FindAllCategoriesUseCase {
  private readonly context = FindAllCategoriesUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<CategoryType>>> {
    try {
      const categoryResource = await this.categoryRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return categoryResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM021,
        context: this.context,
        error,
      });
    }
  }
}
