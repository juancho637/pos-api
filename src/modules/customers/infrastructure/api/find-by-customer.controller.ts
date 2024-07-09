import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CustomerProvidersEnum, customerErrorsCodes } from '../../domain';
import { FindByCustomerUseCase } from '../../application';
import { CustomerPresenter } from '../customer.presenter';

@Controller()
export class FindByCustomerController {
  private readonly context = FindByCustomerController.name;

  constructor(
    @Inject(CustomerProvidersEnum.FIND_BY_CUSTOMER_USE_CASE)
    private readonly findByCustomerUseCase: FindByCustomerUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/customers/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CustomerPresenter> {
    try {
      const customer = await this.findByCustomerUseCase.run({ id });

      return new CustomerPresenter(customer);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM012,
        context: this.context,
        error,
      });
    }
  }
}
