import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { FilterRuleEnum } from '@common/helpers/domain';
import { FindByUserUseCase } from '@modules/users/application';
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
    private readonly findByUserUseCase: FindByUserUseCase,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createCounter: CreateCounterType): Promise<CounterType> {
    try {
      const { userId, ...createCounterFields } = createCounter;

      const user = await this.findByUserUseCase.run({
        filter: {
          property: 'id',
          rule: FilterRuleEnum.EQUALS,
          value: userId,
        },
      });

      const counter = await this.counterRepository.store({
        ...createCounterFields,
        user,
        status: 'ACTIVE',
      });

      return counter as CounterType;
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
