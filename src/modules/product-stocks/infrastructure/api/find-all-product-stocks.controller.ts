import { Controller, Get, Inject } from '@nestjs/common';
import {
  PaginationType,
  SortingType,
  PaginatedResourceType,
  FilteringType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  ProductStockFilterType,
  ProductStockProvidersEnum,
  ProductStockType,
  productStockErrorsCodes,
} from '../../domain';
import { FindAllProductStocksUseCase } from '../../application';
import { ProductStockPresenter } from '../product-stock.presenter';

@Controller()
export class FindAllProductStocksController {
  private readonly context = FindAllProductStocksController.name;

  constructor(
    @Inject(ProductStockProvidersEnum.FIND_ALL_PRODUCT_STOCKS_USE_CASE)
    private readonly findAllProductStocksUseCase: FindAllProductStocksUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/productStocks')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'product_id', 'provider_id'])
    sortParams?: SortingType,
    @FilteringParams(['id', 'product_id', 'provider_id'])
    filterParams?: FilteringType<ProductStockFilterType>[],
  ): Promise<PaginatedResourceType<Partial<ProductStockType>>> {
    try {
      const productStocks = await this.findAllProductStocksUseCase.run({
        pagination: paginationParams,
        sort: sortParams,
        filters: filterParams,
      });

      return {
        ...productStocks,
        items: productStocks.items.map(
          (productStock) => new ProductStockPresenter(productStock),
        ),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM022,
        context: this.context,
        error,
      });
    }
  }
}