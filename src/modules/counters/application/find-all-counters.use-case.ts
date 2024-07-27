import {
  FilteringType,
  PaginatedResourceType,
  PaginationType,
  SortingType,
} from '@common/helpers/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CounterFilterType,
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';

export class FindAllCountersUseCase {
  private readonly context = FindAllCountersUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    pagination: PaginationType,
    sort?: SortingType,
    filters?: FilteringType<CounterFilterType>[],
  ): Promise<PaginatedResourceType<Partial<CounterType>>> {
    try {
      const counterResource = await this.counterRepository.findAll(
        pagination,
        sort,
        filters,
      );

      return counterResource;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM021,
        context: this.context,
        error,
      });
    }
  }
}
