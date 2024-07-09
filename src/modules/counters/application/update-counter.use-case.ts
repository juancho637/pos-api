import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateCounterType,
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';

export class UpdateCounterUseCase {
  private readonly context = UpdateCounterUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(
    id: number,
    updateCounterFields: UpdateCounterType,
  ): Promise<CounterType> {
    try {
      const counter = await this.counterRepository.update(
        id,
        updateCounterFields,
      );

      return counter;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: counterErrorsCodes.CNTM041,
        context: this.context,
        error,
      });
    }
  }
}
