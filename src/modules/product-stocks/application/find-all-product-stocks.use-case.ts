import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProductStockFilterType,
  ProductStockRepositoryInterface,
  ProductStockType,
  productStockErrorsCodes,
} from '../domain';

export class FindAllProductStocksUseCase {
  private readonly context = FindAllProductStocksUseCase.name;

  constructor(
    private readonly productStockRepository: ProductStockRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    pagination,
    sort,
    filters,
  }: FindAllFieldsDto<ProductStockFilterType>): Promise<
    PaginatedResourceType<Partial<ProductStockType>>
  > {
    try {
      const productStockResource = await this.productStockRepository.findAll({
        pagination,
        sort,
        filters,
      });

      return productStockResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productStockErrorsCodes.PRDSTKM021,
        context: this.context,
        error,
      });
    }
  }
}
