import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CustomerRepositoryInterface,
  CustomerType,
  customerErrorsCodes,
} from '../domain';

export class DeleteCustomerUseCase {
  private readonly context = DeleteCustomerUseCase.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<CustomerType> {
    try {
      const customer = await this.customerRepository.delete(id);

      return customer;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM051,
        context: this.context,
        error,
      });
    }
  }
}
