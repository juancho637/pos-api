import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  LoggerServiceInterface,
  LoggerProvidersEnum,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ProductProvidersEnum, productErrorsCodes } from '../../domain';
import { StoreProductUseCase } from '../../application';
import { CreateProductDto } from '../dto';
import { ProductPresenter } from '../product.presenter';

@Controller()
export class StoreProductController {
  private readonly context = StoreProductController.name;

  constructor(
    @Inject(ProductProvidersEnum.STORE_PRODUCT_USE_CASE)
    private readonly storeProductUseCase: StoreProductUseCase,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  @Post('api/products')
  async run(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductPresenter> {
    try {
      const product = await this.storeProductUseCase.run(createProductDto);
      return new ProductPresenter(product);
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw this.exception.internalServerErrorException({
        message: productErrorsCodes.PRDM032,
        context: this.context,
        error,
      });
    }
  }
}
