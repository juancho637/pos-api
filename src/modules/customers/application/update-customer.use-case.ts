import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateCustomerType,
  CustomerRepositoryInterface,
  CustomerType,
  customerErrorsCodes,
} from '../domain';

export class UpdateCustomerUseCase {
  private readonly context = UpdateCustomerUseCase.name;

  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateCustomerFields: UpdateCustomerType,
  ): Promise<CustomerType> {
    try {
      const customer = await this.customerRepository.update(
        id,
        updateCustomerFields,
      );

      return customer;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM041,
        context: this.context,
        error,
      });
    }
  }
}
