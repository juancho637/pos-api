import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByProductUseCaseInterface,
  ProductFilterType,
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';

export class FindByProductUseCase implements FindByProductUseCaseInterface {
  private readonly context = FindByProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(productFilters: ProductFilterType): Promise<ProductType> {
    try {
      const product = await this.productRepository.findOneBy({
        ...productFilters,
      });

      return product;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM011,
        context: this.context,
        error,
      });
    }
  }
}
