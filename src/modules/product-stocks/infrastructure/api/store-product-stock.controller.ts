import { Body, Controller, Inject, Post } from '@nestjs/common';
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
import { StoreProductStockUseCase } from '../../application';
import { CreateProductStockDto } from '../dto';
import { ProductStockPresenter } from '../product-stock.presenter';

@Controller()
export class StoreProductStockController {
  private readonly context = StoreProductStockController.name;

  constructor(
    @Inject(ProductStockProvidersEnum.STORE_PRODUCT_STOCK_USE_CASE)
    private readonly storeProductStockUseCase: StoreProductStockUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/productStocks')
  async run(
    @Body() createProductStockDto: CreateProductStockDto,
  ): Promise<ProductStockPresenter> {
    try {
      const productStock = await this.storeProductStockUseCase.run(
        createProductStockDto,
      );
      return new ProductStockPresenter(productStock);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM032,
        context: this.context,
        error,
      });
    }
  }
}
