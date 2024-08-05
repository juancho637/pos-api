import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CounterFilterType,
  CounterRepositoryInterface,
  CounterType,
  counterErrorsCodes,
} from '../domain';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export class FindByCounterUseCase {
  private readonly context = FindByCounterUseCase.name;

  constructor(
    private readonly counterRepository: CounterRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<CounterFilterType>): Promise<CounterType> {
    try {
      const counter = await this.counterRepository.findOneBy({
        filter,
        relations,
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
