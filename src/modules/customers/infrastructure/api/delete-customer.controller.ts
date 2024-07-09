import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CustomerProvidersEnum, customerErrorsCodes } from '../../domain';
import { DeleteCustomerUseCase } from '../../application';
import { CustomerPresenter } from '../customer.presenter';

@Controller()
export class DeleteCustomerController {
  private readonly context = DeleteCustomerController.name;

  constructor(
    @Inject(CustomerProvidersEnum.DELETE_CUSTOMER_USE_CASE)
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/customers/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CustomerPresenter> {
    try {
      const customer = await this.deleteCustomerUseCase.run(id);

      return new CustomerPresenter(customer);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM052,
        context: this.context,
        error,
      });
    }
  }
}
