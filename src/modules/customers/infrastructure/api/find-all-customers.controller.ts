import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  CustomerFilterType,
  CustomerProvidersEnum,
  CustomerType,
  customerErrorsCodes,
} from '../../domain';
import { FindAllCustomersUseCase } from '../../application';
import { CustomerPresenter } from '../customer.presenter';

@Controller()
export class FindAllCustomersController {
  private readonly context = FindAllCustomersController.name;

  constructor(
    @Inject(CustomerProvidersEnum.FIND_ALL_CUSTOMERS_USE_CASE)
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/customers')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'name', 'email']) sortParams?: SortingType,
    @FilteringParams(['id', 'name', 'email'])
    filterParams?: FilteringType<CustomerFilterType>[],
  ): Promise<PaginatedResourceType<Partial<CustomerType>>> {
    try {
      const customers = await this.findAllCustomersUseCase.run(
        paginationParams,
        sortParams,
        filterParams,
      );

      return {
        ...customers,
        items: customers.items.map(
          (customer) => new CustomerPresenter(customer),
        ),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM022,
        context: this.context,
        error,
      });
    }
  }
}
