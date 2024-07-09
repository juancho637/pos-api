import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class DeleteCategoryUseCase {
  private readonly context = DeleteCategoryUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<CategoryType> {
    try {
      const category = await this.categoryRepository.delete(id);

      return category;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM051,
        context: this.context,
        error,
      });
    }
  }
}
