import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';

export class DeleteProductUseCase {
  private readonly context = DeleteProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<ProductType> {
    try {
      const product = await this.productRepository.delete(id);

      return product;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM051,
        context: this.context,
        error,
      });
    }
  }
}
