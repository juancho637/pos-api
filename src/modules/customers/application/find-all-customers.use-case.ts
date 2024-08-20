import {
  FindAllFieldsDto,
  PaginatedResourceType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CustomerFilterType,
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

  async run({
    pagination,
    sort,
    filters,
    relations,
  }: FindAllFieldsDto<CustomerFilterType>): Promise<
    PaginatedResourceType<Partial<CustomerType>>
  > {
    try {
      const customers = await this.customerRepository.findAll({
        pagination,
        sort,
        filters,
        relations,
      });

      return customers;
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
