import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  CreateProviderType,
  ProviderRepositoryInterface,
  ProviderType,
  providerErrorsCodes,
} from '../domain';

export class StoreProviderUseCase {
  private readonly context = StoreProviderUseCase.name;

  constructor(
    private readonly providerRepository: ProviderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({ name, ...fields }: CreateProviderType): Promise<ProviderType> {
    try {
      const newName = `${name}`;
      const provider = await this.providerRepository.store({
        name: newName,
        ...fields,
      });
      return provider;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM031,
        context: this.context,
        error,
      });
    }
  }
}
