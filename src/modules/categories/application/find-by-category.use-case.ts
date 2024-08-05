import { FindOneByFieldsDto } from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CategoryFilterType,
  CategoryRepositoryInterface,
  CategoryType,
  categoryErrorsCodes,
} from '../domain';

export class FindByCategoryUseCase {
  private readonly context = FindByCategoryUseCase.name;

  constructor(
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<CategoryFilterType>): Promise<CategoryType> {
    try {
      const category = await this.categoryRepository.findOneBy({
        filter,
        relations,
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
