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
import {
  ProductStockProvidersEnum,
  productStockErrorsCodes,
} from '../../domain';
import { DeleteProductStockUseCase } from '../../application';
import { ProductStockPresenter } from '../product-stock.presenter';

@Controller()
export class DeleteProductStockController {
  private readonly context = DeleteProductStockController.name;

  constructor(
    @Inject(ProductStockProvidersEnum.DELETE_PRODUCT_STOCK_USE_CASE)
    private readonly deleteProductStockUseCase: DeleteProductStockUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/product-stocks/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductStockPresenter> {
    try {
      const productStock = await this.deleteProductStockUseCase.run(id);

      return new ProductStockPresenter(productStock);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM052,
        context: this.context,
        error,
      });
    }
  }
}
