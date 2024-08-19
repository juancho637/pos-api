import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  ProductStockProvidersEnum,
  productStockErrorsCodes,
} from '../../domain';
import { FindByProductStockUseCase } from '../../application';
import { ProductStockPresenter } from '../product-stock.presenter';

@Controller()
export class FindByProductStockController {
  private readonly context = FindByProductStockController.name;

  constructor(
    @Inject(ProductStockProvidersEnum.FIND_BY_PRODUCT_STOCK_USE_CASE)
    private readonly findByProductStockUseCase: FindByProductStockUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/productStocks/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductStockPresenter> {
    try {
      const productStock = await this.findByProductStockUseCase.run({ id });

      return new ProductStockPresenter({
        ...productStock,
      });
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM012,
        context: this.context,
        error,
      });
    }
  }
}
