import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CategoryProvidersEnum, categoryErrorsCodes } from '../../domain';
import { StoreCategoryUseCase } from '../../application';
import { CreateCategoryDto } from '../dto';
import { CategoryPresenter } from '../category.presenter';

@Controller()
export class StoreCategoryController {
  private readonly context = StoreCategoryController.name;

  constructor(
    @Inject(CategoryProvidersEnum.STORE_CATEGORY_USE_CASE)
    private readonly storeCategoryUseCase: StoreCategoryUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/categories')
  async run(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryPresenter> {
    try {
      const category = await this.storeCategoryUseCase.run(createCategoryDto);

      return new CategoryPresenter(category);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM032,
        context: this.context,
        error,
      });
    }
  }
}
