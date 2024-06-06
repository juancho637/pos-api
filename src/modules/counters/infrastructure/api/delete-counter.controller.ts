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
import { CounterProvidersEnum, counterErrorsCodes } from '../../domain';
import { DeleteCounterUseCase } from '../../application';
import { CounterPresenter } from '../counter.presenter';

@Controller()
export class DeleteCounterController {
  private readonly context = DeleteCounterController.name;

  constructor(
    @Inject(CounterProvidersEnum.DELETE_COUNTER_USE_CASE)
    private readonly deleteCounterUseCase: DeleteCounterUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/counters/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<CounterPresenter> {
    try {
      const counter = await this.deleteCounterUseCase.run(id);

      return new CounterPresenter(counter);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM052,
        context: this.context,
        error,
      });
    }
  }
}
