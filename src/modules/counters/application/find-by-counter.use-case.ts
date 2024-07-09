import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByCounterUseCaseInterface,
  CounterFilterType,
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';

export class FindByCounterUseCase implements FindByCounterUseCaseInterface {
  private readonly context = FindByCounterUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(counterFilters: CounterFilterType): Promise<CounterType> {
    try {
      const counter = await this.counterRepository.findOneBy({
        ...counterFilters,
      });

      return counter;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM011,
        context: this.context,
        error,
      });
    }
  }
}
