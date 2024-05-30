import {
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ProviderProvidersEnum, providerErrorsCodes } from '../../domain';
import { DeleteProviderUseCase } from '../../application';
import { ProviderPresenter } from '../provider.presenter';

@Controller()
export class DeleteProviderController {
  private readonly context = DeleteProviderController.name;

  constructor(
    @Inject(ProviderProvidersEnum.DELETE_PROVIDER_USE_CASE)
    private readonly deleteproviderUseCase: DeleteProviderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/providers/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<ProviderPresenter> {
    try {
      const user = await this.deleteproviderUseCase.run(id);

      return new ProviderPresenter(user);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM052,
        context: this.context,
        error,
      });
    }
  }
}
