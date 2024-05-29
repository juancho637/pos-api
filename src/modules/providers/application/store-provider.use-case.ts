import { HashServiceInterface } from '@common/adapters/hash/domain';
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
    private readonly hashService: HashServiceInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(createProvider: CreateProviderType): Promise<ProviderType> {
    try {
      this.logger.error({
        message: 'DEBUG',
        context: JSON.stringify(createProvider),
      });
      const provider = await this.providerRepository.store(createProvider);
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
