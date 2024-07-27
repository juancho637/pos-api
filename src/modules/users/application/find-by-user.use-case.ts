import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByUserUseCaseInterface,
  UserRepositoryInterface,
  UserType,
  userErrorsCodes,
} from '../domain';
import { FindByUserUseCaseDto } from '../domain/types';

export class FindByUserUseCase implements FindByUserUseCaseInterface {
  private readonly context = FindByUserUseCase.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    userFilters,
    relations,
  }: FindByUserUseCaseDto): Promise<UserType> {
    try {
      const user = await this.userRepository.findOneBy(
        { ...userFilters },
        relations,
      );

      return user;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM011,
        context: this.context,
        error,
      });
    }
  }
}
