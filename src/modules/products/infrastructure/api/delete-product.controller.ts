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
import { ProductProvidersEnum, productErrorsCodes } from '../../domain';
import { DeleteProductUseCase } from '../../application';
import { ProductPresenter } from '../product.presenter';

@Controller()
export class DeleteProductController {
  private readonly context = DeleteProductController.name;

  constructor(
    @Inject(ProductProvidersEnum.DELETE_PRODUCT_USE_CASE)
    private readonly deleteProductUseCase: DeleteProductUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Delete('api/products/:id')
  async run(@Param('id', ParseIntPipe) id: number): Promise<ProductPresenter> {
    try {
      const product = await this.deleteProductUseCase.run(id);

      return new ProductPresenter(product);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM052,
        context: this.context,
        error,
      });
    }
  }
}
