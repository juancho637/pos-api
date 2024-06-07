import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CounterProvidersEnum, counterErrorsCodes } from '../../domain';
import { StoreCounterUseCase } from '../../application';
import { CreateCounterDto } from '../dto';
import { CounterPresenter } from '../counter.presenter';

@Controller()
export class StoreCounterController {
  private readonly context = StoreCounterController.name;

  constructor(
    @Inject(CounterProvidersEnum.STORE_COUNTER_USE_CASE)
    private readonly storeCounterUseCase: StoreCounterUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/counters')
  async run(
    @Body() createCounterDto: CreateCounterDto,
  ): Promise<CounterPresenter> {
    try {
      const counter = await this.storeCounterUseCase.run(createCounterDto);

      return new CounterPresenter(counter);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM032,
        context: this.context,
        error,
      });
    }
  }
}
