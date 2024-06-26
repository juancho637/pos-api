import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  FindByUserUseCaseInterface,
  UserFilterType,
  UserRepositoryInterface,
  UserType,
  userErrorsCodes,
} from '../domain';

export class FindByUserUseCase implements FindByUserUseCaseInterface {
  private readonly context = FindByUserUseCase.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(userFilters: UserFilterType): Promise<UserType> {
    try {
      const user = await this.userRepository.findOneBy({ ...userFilters });

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
