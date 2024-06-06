import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByCustomerUseCaseInterface,
  CustomerFilterType,
  CustomerRepositoryInterface,
  CustomerType,
  customerErrorsCodes,
} from '../domain';

export class FindByCustomerUseCase implements FindByCustomerUseCaseInterface {
  private readonly context = FindByCustomerUseCase.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(customerFilters: CustomerFilterType): Promise<CustomerType> {
    try {
      const customer = await this.customerRepository.findOneBy({
        ...customerFilters,
      });

      return customer;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM011,
        context: this.context,
        error,
      });
    }
  }
}
