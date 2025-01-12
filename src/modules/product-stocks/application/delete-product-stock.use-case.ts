import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';

export class DeleteProductStockUseCase {
  private readonly context = DeleteProductStockUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<ProductStockType> {
    try {
      const productStock = await this.productStockRepository.delete(id);

      return productStock;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM051,
        context: this.context,
        error,
      });
    }
  }
}
