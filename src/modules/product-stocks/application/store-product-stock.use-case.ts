import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateProductStockType,
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';
import { FindByProductUseCaseInterface } from '@modules/products/domain';
import { FindByProviderUseCaseInterface } from '@modules/provider/domain';

export class StoreProductStockUseCase {
  private readonly context = StoreProductStockUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly findByProductUseCase: FindByProductUseCaseInterface,
    private readonly findByProviderUseCase: FindByProviderUseCaseInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    productId,
    providerId,
    ...createProductStockFields
  }: CreateProductStockType): Promise<ProductStockType> {
    try {
      const product = await this.findByProductUseCase.run({ id: productId });

      const provider = await this.findByProviderUseCase.run({ id: providerId });

      const productStock = await this.productStockRepository.store({
        product,
        provider,
        ...createProductStockFields,
      });

      return productStock;
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
