import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import { LoggerModule } from '@common/adapters/logger/infrastructure';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import {
  ProductStockProvidersEnum,
  ProductStockRepositoryInterface,
} from '../domain';
import {
  DeleteProductStockUseCase,
  FindAllProductStocksUseCase,
  FindByProductStockUseCase,
  StoreProductStockUseCase,
  UpdateProductStockUseCase,
} from '../application';
import {
  ProductStockEntity,
  ProductStockTypeOrmRepository,
} from './persistence';
import {
  DeleteProductStockController,
  FindAllProductStocksController,
  FindByProductStockController,
  StoreProductStockController,
  UpdateProductStockController,
} from './api';
import { ProductProvidersEnum } from '@modules/products/domain';
import { FindByProductUseCase } from '@modules/products/application';
import { ProviderProvidersEnum } from '@modules/providers/domain';
import { FindByProviderUseCase } from '@modules/providers/application';
import { ProductModule } from '@modules/products/infrastructure';
import { ProviderModule } from '@modules/providers/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductStockEntity]),
    ProductModule,
    ProviderModule,
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [
    FindAllProductStocksController,
    FindByProductStockController,
    StoreProductStockController,
    UpdateProductStockController,
    DeleteProductStockController,
  ],
  providers: [
    {
      provide: ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
      useClass: ProductStockTypeOrmRepository,
    },
    {
      inject: [
        ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductStockProvidersEnum.FIND_ALL_PRODUCT_STOCKS_USE_CASE,
      useFactory: (
        userRepositoy: ProductStockRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllProductStocksUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductStockProvidersEnum.FIND_BY_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: ProductStockRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByProductStockUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductStockProvidersEnum.STORE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: ProductStockRepositoryInterface,
        findByProductUseCase: FindByProductUseCase,
        findByProviderUseCase: FindByProviderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreProductStockUseCase(
          userRepositoy,
          findByProductUseCase,
          findByProviderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductStockProvidersEnum.UPDATE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: ProductStockRepositoryInterface,
        findByProductUseCase: FindByProductUseCase,
        findByProviderUseCase: FindByProviderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateProductStockUseCase(
          userRepositoy,
          findByProductUseCase,
          findByProviderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductStockProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductStockProvidersEnum.DELETE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: ProductStockRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteProductStockUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    ProductStockProvidersEnum.FIND_ALL_PRODUCT_STOCKS_USE_CASE,
    ProductStockProvidersEnum.FIND_BY_PRODUCT_STOCK_USE_CASE,
    ProductStockProvidersEnum.STORE_PRODUCT_STOCK_USE_CASE,
    ProductStockProvidersEnum.UPDATE_PRODUCT_STOCK_USE_CASE,
    ProductStockProvidersEnum.DELETE_PRODUCT_STOCK_USE_CASE,
  ],
})
export class ProductStockModule {}
