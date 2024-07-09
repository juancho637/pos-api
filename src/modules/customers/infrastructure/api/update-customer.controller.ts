import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Put,
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
import { UpdateCustomerUseCase } from '../../application';
import { UpdateCustomerDto } from '../dto';
import { CustomerPresenter } from '../customer.presenter';

@Controller()
export class UpdateCustomerController {
  private readonly context = UpdateCustomerController.name;

  constructor(
    @Inject(CustomerProvidersEnum.UPDATE_CUSTOMER_USE_CASE)
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/customers/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerPresenter> {
    try {
      const customer = await this.updateCustomerUseCase.run(
        id,
        updateCustomerDto,
      );

      return new CustomerPresenter(customer);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM042,
        context: this.context,
        error,
      });
    }
  }
}
