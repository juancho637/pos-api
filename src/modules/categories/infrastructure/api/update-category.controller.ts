import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Put,
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
import { UpdateCategoryUseCase } from '../../application';
import { UpdateCategoryDto } from '../dto';
import { CategoryPresenter } from '../category.presenter';

@Controller()
export class UpdateCategoryController {
  private readonly context = UpdateCategoryController.name;

  constructor(
    @Inject(CategoryProvidersEnum.UPDATE_CATEGORY_USE_CASE)
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/categories/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryPresenter> {
    try {
      const category = await this.updateCategoryUseCase.run(
        id,
        updateCategoryDto,
      );

      return new CategoryPresenter(category);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: categoryErrorsCodes.CATM042,
        context: this.context,
        error,
      });
    }
  }
}
