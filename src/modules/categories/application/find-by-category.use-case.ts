import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByCategoryUseCaseInterface,
  CategoryFilterType,
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class FindByCategoryUseCase implements FindByCategoryUseCaseInterface {
  private readonly context = FindByCategoryUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(categoryFilters: CategoryFilterType): Promise<CategoryType> {
    try {
      const category = await this.categoryRepository.findOneBy({
        ...categoryFilters,
      });

      return category;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM011,
        context: this.context,
        error,
      });
    }
  }
}
