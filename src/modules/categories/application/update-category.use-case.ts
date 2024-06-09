import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateCategoryType,
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class UpdateCategoryUseCase {
  private readonly context = UpdateCategoryUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateCategoryFields: UpdateCategoryType,
  ): Promise<CategoryType> {
    try {
      const category = await this.categoryRepository.update(
        id,
        updateCategoryFields,
      );

      return category;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM041,
        context: this.context,
        error,
      });
    }
  }
}
