import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CustomerRepositoryInterface,
  CustomerType,
  customerErrorsCodes,
} from '../domain';

export class FindAllCustomersUseCase {
  private readonly context = FindAllCustomersUseCase.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType[],
  ): Promise<PaginatedResourceType<Partial<CustomerType>>> {
    try {
      const providerResource = await this.customerRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return providerResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM021,
        context: this.context,
        error,
      });
    }
  }
}
