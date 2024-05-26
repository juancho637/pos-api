import { HashServiceInterface } from '@common/adapters/hash/domain';
import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateUserType,
  UserRepositoryInterface,
  UserType,
  userErrorsCodes,
} from '../domain';

export class StoreUserUseCase {
  private readonly context = StoreUserUseCase.name;

  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createUser: CreateUserType): Promise<UserType> {
    try {
      const hashPassword = await this.hashService.hash(createUser.password);

      const user = await this.userRepository.store({
        ...createUser,
        password: hashPassword,
      });

      return user;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: userErrorsCodes.UM031,
        context: this.context,
        error,
      });
    }
  }
}
