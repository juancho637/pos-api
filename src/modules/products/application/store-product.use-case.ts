import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateProductType,
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';
import { FindByCategoryUseCaseInterface } from '@modules/categories/domain';

export class StoreProductUseCase {
  private readonly context = StoreProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly findByCategoryUseCase: FindByCategoryUseCaseInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    category,
    ...createProduct
  }: CreateProductType): Promise<ProductType> {
    try {
      await this.findByCategoryUseCase.run({ id: category });

      const product = await this.productRepository.store({
        category,
        ...createProduct,
      });

      return product;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM032,
        context: this.context,
        error,
      });
    }
  }
}
