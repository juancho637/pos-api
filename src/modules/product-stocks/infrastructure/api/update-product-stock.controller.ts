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
import {
  ProductStockProvidersEnum,
  productStockErrorsCodes,
} from '../../domain';
import { UpdateProductStockUseCase } from '../../application';
import { UpdateProductStockDto } from '../dto';
import { ProductStockPresenter } from '../product-stock.presenter';

@Controller()
export class UpdateProductStockController {
  private readonly context = UpdateProductStockController.name;

  constructor(
    @Inject(ProductStockProvidersEnum.UPDATE_PRODUCT_STOCK_USE_CASE)
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/product-stocks/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ): Promise<ProductStockPresenter> {
    try {
      const productStock = await this.updateProductStockUseCase.run(
        id,
        updateProductStockDto,
      );

      return new ProductStockPresenter(productStock);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM042,
        context: this.context,
        error,
      });
    }
  }
}
