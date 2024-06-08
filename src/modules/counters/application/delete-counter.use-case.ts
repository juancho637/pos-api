import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';

export class DeleteCounterUseCase {
  private readonly context = DeleteCounterUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<CounterType> {
    try {
      const counter = await this.counterRepository.delete(id);

      return counter;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM051,
        context: this.context,
        error,
      });
    }
  }
}
