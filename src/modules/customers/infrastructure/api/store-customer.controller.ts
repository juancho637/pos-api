import { Body, Controller, Inject, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CustomerProvidersEnum, customerErrorsCodes } from '../../domain';
import { StoreCustomerUseCase } from '../../application';
import { CreateCustomerDto } from '../dto';
import { CustomerPresenter } from '../customer.presenter';

@Controller()
export class StoreCustomerController {
  private readonly context = StoreCustomerController.name;

  constructor(
    @Inject(CustomerProvidersEnum.STORE_CUSTOMER_USE_CASE)
    private readonly storeCustomerUseCase: StoreCustomerUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/customers')
  async run(
    @Body() createProviderDto: CreateCustomerDto,
  ): Promise<CustomerPresenter> {
    try {
      const provider = await this.storeCustomerUseCase.run(
        plainToClass(CreateCustomerDto, createProviderDto),
      );

      return new CustomerPresenter(provider);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: customerErrorsCodes.CUSM032,
        context: this.context,
        error,
      });
    }
  }
}
