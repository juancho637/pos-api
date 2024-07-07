import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateProductType,
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';

export class UpdateProductUseCase {
  private readonly context = UpdateProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateProductFields: UpdateProductType,
  ): Promise<ProductType> {
    try {
      const product = await this.productRepository.update(
        id,
        updateProductFields,
      );

      return product;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM041,
        context: this.context,
        error,
      });
    }
  }
}
