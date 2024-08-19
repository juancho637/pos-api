import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProductFilterType,
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export class FindByProductUseCase {
  private readonly context = FindByProductUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<ProductFilterType>): Promise<ProductType> {
    try {
      const product = await this.productRepository.findOneBy({
        filter,
        relations,
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
