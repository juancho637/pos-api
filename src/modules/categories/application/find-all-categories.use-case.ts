import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CategoryFilterType,
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

  async run({
    pagination,
    sort,
    filters,
    relations,
  }: FindAllFieldsDto<CategoryFilterType>): Promise<
    PaginatedResourceType<Partial<CategoryType>>
  > {
    try {
      const categoryResource = await this.categoryRepository.findAll({
        pagination,
        sort,
        filters,
        relations,
      });

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
