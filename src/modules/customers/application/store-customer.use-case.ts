import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateCustomerType,
  CustomerRepositoryInterface,
  CustomerType,
  customerErrorsCodes,
} from '../domain';

export class StoreCustomerUseCase {
  private readonly context = StoreCustomerUseCase.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({ ...fields }: CreateCustomerType): Promise<CustomerType> {
    try {
      const provider = await this.customerRepository.store({
        ...fields,
      });
      return provider;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM031,
        context: this.context,
        error,
      });
    }
  }
}
