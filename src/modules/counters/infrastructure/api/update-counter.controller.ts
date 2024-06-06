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
import { CounterProvidersEnum, counterErrorsCodes } from '../../domain';
import { UpdateCounterUseCase } from '../../application';
import { UpdateCounterDto } from '../dto';
import { CounterPresenter } from '../counter.presenter';

@Controller()
export class UpdateCounterController {
  private readonly context = UpdateCounterController.name;

  constructor(
    @Inject(CounterProvidersEnum.UPDATE_COUNTER_USE_CASE)
    private readonly updateCounterUseCase: UpdateCounterUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/counters/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCounterDto: UpdateCounterDto,
  ): Promise<CounterPresenter> {
    try {
      const counter = await this.updateCounterUseCase.run(id, updateCounterDto);

      return new CounterPresenter(counter);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM042,
        context: this.context,
        error,
      });
    }
  }
}
