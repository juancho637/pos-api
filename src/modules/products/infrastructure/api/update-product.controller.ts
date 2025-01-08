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
import { ProductProvidersEnum, productErrorsCodes } from '../../domain';
import { UpdateProductUseCase } from '../../application';
import { UpdateProductDto } from '../dto';
import { ProductPresenter } from '../product.presenter';

@Controller()
export class UpdateProductController {
  private readonly context = UpdateProductController.name;

  constructor(
    @Inject(ProductProvidersEnum.UPDATE_PRODUCT_USE_CASE)
    private readonly updateProductUseCase: UpdateProductUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Put('api/products/:id')
  async run(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductPresenter> {
    try {
      const product = await this.updateProductUseCase.run(id, updateProductDto);

      return new ProductPresenter(product);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM042,
        context: this.context,
        error,
      });
    }
  }
}
