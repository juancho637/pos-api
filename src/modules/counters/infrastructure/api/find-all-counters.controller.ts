import { Controller, Get, Inject } from '@nestjs/common';
import {
  FilteringType,
  PaginationType,
  SortingType,
  PaginatedResourceType,
} from '@common/helpers/domain';
import {
  PaginationParams,
  FilteringParams,
  SortingParams,
} from '@common/helpers/infrastructure';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import {
  CounterFilterType,
  CounterProvidersEnum,
  CounterType,
  counterErrorsCodes,
} from '../../domain';
import { FindAllCountersUseCase } from '../../application';
import { CounterPresenter } from '../counter.presenter';

@Controller()
export class FindAllCountersController {
  private readonly context = FindAllCountersController.name;

  constructor(
    @Inject(CounterProvidersEnum.FIND_ALL_COUNTERS_USE_CASE)
    private readonly findAllCountersUseCase: FindAllCountersUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Get('api/counters')
  async run(
    @PaginationParams() paginationParams?: PaginationType,
    @SortingParams(['id', 'branch_id', 'user_id']) sortParams?: SortingType,
    @FilteringParams(['id', 'branch_id', 'user_id'])
    filterParams?: FilteringType<CounterFilterType>[],
  ): Promise<PaginatedResourceType<Partial<CounterType>>> {
    try {
      const counters = await this.findAllCountersUseCase.run(
        paginationParams,
        sortParams,
        filterParams,
      );

      return {
        ...counters,
        items: counters.items.map((counter) => new CounterPresenter(counter)),
      };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM022,
        context: this.context,
        error,
      });
    }
  }
}
