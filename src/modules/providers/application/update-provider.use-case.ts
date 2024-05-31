import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  UpdateProviderType,
  ProviderRepositoryInterface,
  ProviderType,
  providerErrorsCodes,
} from '../domain';

export class UpdateProviderUseCase {
  private readonly context = UpdateProviderUseCase.name;

  constructor(
    private readonly providerRepository: ProviderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run(id: number, updateProviderFields: UpdateProviderType): Promise<ProviderType> {
    try {
      const provider = await this.providerRepository.update(id, updateProviderFields);

      return provider;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM041,
        context: this.context,
        error,
      });
    }
  }
}