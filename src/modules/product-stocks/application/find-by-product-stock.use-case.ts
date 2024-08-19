import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByProductStockUseCaseInterface,
  ProductStockFilterType,
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';

export class FindByProductStockUseCase
  implements FindByProductStockUseCaseInterface
{
  private readonly context = FindByProductStockUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    productStockFilters: ProductStockFilterType,
  ): Promise<ProductStockType> {
    try {
      const productStock = await this.productStockRepository.findOneBy({
        ...productStockFilters,
      });

      return productStock;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM011,
        context: this.context,
        error,
      });
    }
  }
}
