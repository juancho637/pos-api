import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateProductStockType,
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';
import { FindByProductUseCaseInterface } from '@modules/products/domain';
import { FindByProviderUseCaseInterface } from '@modules/providers/domain';

export class UpdateProductStockUseCase {
  private readonly context = UpdateProductStockUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly findByProductUseCase: FindByProductUseCaseInterface,
    private readonly findByProviderUseCase: FindByProviderUseCaseInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    {
      productId,
      providerId,
      ...updateProductStockFields
    }: UpdateProductStockType,
  ): Promise<ProductStockType> {
    try {
      const product = await this.findByProductUseCase.run({
        id: productId,
      });

      const provider = await this.findByProviderUseCase.run({
        id: providerId,
      });

      const productStock = await this.productStockRepository.update(id, {
        product,
        provider,
        ...updateProductStockFields,
      });

      return productStock;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM041,
        context: this.context,
        error,
      });
    }
  }
}
