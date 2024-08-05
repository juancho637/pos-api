import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { ExceptionServiceInterface } from '@common/adapters/exception/domain';
import {
  ProviderFilterType,
  ProviderRepositoryInterface,
  ProviderType,
  providerErrorsCodes,
} from '../domain';
import { FindOneByFieldsDto } from '@common/helpers/domain';

export class FindByProviderUseCase {
  private readonly context = FindByProviderUseCase.name;

  constructor(
    private readonly providerRepository: ProviderRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async run({
    filter,
    relations,
  }: FindOneByFieldsDto<ProviderFilterType>): Promise<ProviderType> {
    try {
      const provider = await this.providerRepository.findOneBy({
        filter,
        relations,
      });

      return provider;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM011,
        context: this.context,
        error,
      });
    }
  }
}
