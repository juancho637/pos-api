import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { CounterProvidersEnum, counterErrorsCodes } from '../../domain';
import { FindByCounterUseCase } from '../../application';
import { CounterPresenter } from '../counter.presenter';

@Controller()
export class FindByCounterController {
  private readonly context = FindByCounterController.name;

  constructor(
    @Inject(CounterProvidersEnum.FIND_BY_COUNTER_USE_CASE)
    private readonly findByCounterUseCase: FindByCounterUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/counters/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CounterPresenter> {
    try {
      const counter = await this.findByCounterUseCase.run({ id });

      return new CounterPresenter(counter);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM012,
        context: this.context,
        error,
      });
    }
  }
}
