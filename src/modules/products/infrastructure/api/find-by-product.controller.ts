import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ProductProvidersEnum, productErrorsCodes } from '../../domain';
import { FindByProductUseCase } from '../../application';
import { ProductPresenter } from '../product.presenter';

@Controller()
export class FindByProductController {
  private readonly context = FindByProductController.name;

  constructor(
    @Inject(ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE)
    private readonly findByProductUseCase: FindByProductUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/products/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<ProductPresenter> {
    try {
      const product = await this.findByProductUseCase.run({ id });

      return new ProductPresenter({
        ...product,
      });
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM012,
        context: this.context,
        error,
      });
    }
  }
}
