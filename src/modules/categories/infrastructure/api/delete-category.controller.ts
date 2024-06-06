import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CategoryProvidersEnum, categoryErrorsCodes } from '../../domain';
import { DeleteCategoryUseCase } from '../../application';
import { CategoryPresenter } from '../category.presenter';

@Controller()
export class DeleteCategoryController {
  private readonly context = DeleteCategoryController.name;

  constructor(
    @Inject(CategoryProvidersEnum.DELETE_CATEGORY_USE_CASE)
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/categories/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CategoryPresenter> {
    try {
      const category = await this.deleteCategoryUseCase.run(id);

      return new CategoryPresenter(category);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM052,
        context: this.context,
        error,
      });
    }
  }
}
