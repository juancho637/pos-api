import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
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
  ProductProvidersEnum,
  ProductType,
  productErrorsCodes,
} from '../../domain';
import { FindAllProductsUseCase } from '../../application';
import { ProductPresenter } from '../product.presenter';

@Controller()
export class FindAllProductsController {
  private readonly context = FindAllProductsController.name;

  constructor(
    @Inject(ProductProvidersEnum.FIND_ALL_PRODUCTS_USE_CASE)
    private readonly findAllProductsUseCase: FindAllProductsUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/products')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'branch_id', 'user_id']) sortParams?: SortingType,
    @FilteringParams(['id', 'branch_id', 'user_id'])
    filterParams?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<ProductType>>> {
    try {
      const products = await this.findAllProductsUseCase.run(
        paginationParams,
        sortParams,
        filterParams,
      );

      return {
        ...products,
        items: products.items.map((product) => new ProductPresenter(product)),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM022,
        context: this.context,
        error,
      });
    }
  }
}
