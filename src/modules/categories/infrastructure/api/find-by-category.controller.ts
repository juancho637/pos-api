import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CategoryProvidersEnum, categoryErrorsCodes } from '../../domain';
import { FindByCategoryUseCase } from '../../application';
import { CategoryPresenter } from '../category.presenter';

@Controller()
export class FindByCategoryController {
  private readonly context = FindByCategoryController.name;

  constructor(
    @Inject(CategoryProvidersEnum.FIND_BY_CATEGORY_USE_CASE)
    private readonly findByCategoryUseCase: FindByCategoryUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/categories/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CategoryPresenter> {
    try {
      const category = await this.findByCategoryUseCase.run({ id });

      return new CategoryPresenter(category);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM012,
        context: this.context,
        error,
      });
    }
  }
}
