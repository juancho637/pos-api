import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProviderRepositoryInterface,
  ProviderType,
  providerErrorsCodes,
} from '../domain';

export class DeleteProviderUseCase {
  private readonly context = DeleteProviderUseCase.name;

  constructor(
    private readonly providerRepository: ProviderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number): Promise<ProviderType> {
    try {
      const provider = await this.providerRepository.delete(id);

      return provider;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM051,
        context: this.context,
        error,
      });
    }
  }
}
