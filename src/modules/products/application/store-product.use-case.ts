import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FindByCategoryUseCase } from '@modules/categories/application';
import {
  CreateProductType,
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';
import { FilterRuleEnum } from '@common/helpers/domain';

export class StoreProductUseCase {
  private readonly context = StoreProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly findByCategoryUseCase: FindByCategoryUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    categoryId,
    ...createProductFields
  }: CreateProductType): Promise<ProductType> {
    try {
      const category = await this.findByCategoryUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: categoryId,
        },
      });

      const product = await this.productRepository.store({
        category,
        ...createProductFields,
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
