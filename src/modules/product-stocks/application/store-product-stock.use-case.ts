import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateProductStockType,
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';
import { FindByProductUseCase } from '@modules/products/application';
import { FindByProviderUseCase } from '@modules/providers/application';
import { FilterRuleEnum } from '@common/helpers/domain';

export class StoreProductStockUseCase {
  private readonly context = StoreProductStockUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly findByProductUseCase: FindByProductUseCase,
    private readonly findByProviderUseCase: FindByProviderUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    productId,
    providerId,
    ...createProductStockFields
  }: CreateProductStockType): Promise<ProductStockType> {
    try {
      const product = await this.findByProductUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: productId,
        },
      });

      const provider = await this.findByProviderUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: providerId,
        },
      });

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
