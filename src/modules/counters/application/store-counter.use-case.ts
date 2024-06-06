import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateCounterType,
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';

export class StoreCounterUseCase {
  private readonly context = StoreCounterUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createCounter: CreateCounterType): Promise<CounterType> {
    try {
      const counter = await this.counterRepository.store({
        ...createCounter,
      });

      return counter;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM031,
        context: this.context,
        error,
      });
    }
  }
}
