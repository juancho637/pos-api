import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateCategoryType,
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class StoreCategoryUseCase {
  private readonly context = StoreCategoryUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createCategory: CreateCategoryType): Promise<CategoryType> {
    try {
      const category = await this.categoryRepository.store({
        ...createCategory,
      });

      return category as CategoryType;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM031,
        context: this.context,
        error,
      });
    }
  }
}
