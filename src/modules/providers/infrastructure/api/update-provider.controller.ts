import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Put,
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
import { UpdateProviderUseCase } from '../../application';
import { UpdateProviderDto } from '../dto';
import { ProviderPresenter } from '../provider.presenter';

@Controller()
export class UpdateProviderController {
  private readonly context = UpdateProviderController.name;

  constructor(
    @Inject(ProviderProvidersEnum.UPDATE_PROVIDER_USE_CASE)
    private readonly updateProviderUseCase: UpdateProviderUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/providers/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ProviderPresenter> {
    try {
      const provider = await this.updateProviderUseCase.run(id, updateProviderDto);

      return new ProviderPresenter(provider);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: providerErrorsCodes.PM042,
        context: this.context,
        error,
      });
    }
  }
}