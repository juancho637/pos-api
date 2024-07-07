import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProductRepositoryInterface,
  ProductType,
  productErrorsCodes,
} from '../domain';

export class FindAllProductsUseCase {
  private readonly context = FindAllProductsUseCase.name;

  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<ProductType>>> {
    try {
      const productResource = await this.productRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return productResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM021,
        context: this.context,
        error,
      });
    }
  }
}
