import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import { UserRepositoryInterface, UserType, userErrorsCodes } from '../domain';

export class FindByUserUseCase {
  private readonly context = FindByUserUseCase.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<UserType> {
    try {
      const user = await this.userRepository.findOneBy({ id });

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
