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
import { ProductProvidersEnum, ProductRepositoryInterface } from '../domain';
import {
  DeleteProductUseCase,
  FindAllProductsUseCase,
  FindByProductUseCase,
  StoreProductUseCase,
  UpdateProductUseCase,
} from '../application';
import { ProductEntity, ProductTypeOrmRepository } from './persistence';
import {
  DeleteProductController,
  FindAllProductsController,
  FindByProductController,
  StoreProductController,
  UpdateProductController,
} from './api';
import { CategoryProvidersEnum } from '@modules/categories/domain';
import { FindByCategoryUseCase } from '@modules/categories/application';
import { CategoryModule } from '@modules/categories/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CategoryModule,
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [
    FindAllProductsController,
    FindByProductController,
    StoreProductController,
    UpdateProductController,
    DeleteProductController,
  ],
  providers: [
    {
      provide: ProductProvidersEnum.PRODUCT_REPOSITORY,
      useClass: ProductTypeOrmRepository,
    },
    {
      inject: [
        ProductProvidersEnum.PRODUCT_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductProvidersEnum.FIND_ALL_PRODUCTS_USE_CASE,
      useFactory: (
        userRepositoy: ProductRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllProductsUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductProvidersEnum.PRODUCT_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
      useFactory: (
        userRepositoy: ProductRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByProductUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductProvidersEnum.PRODUCT_REPOSITORY,
        CategoryProvidersEnum.FIND_BY_CATEGORY_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductProvidersEnum.STORE_PRODUCT_USE_CASE,
      useFactory: (
        userRepositoy: ProductRepositoryInterface,
        findByCategoryUseCase: FindByCategoryUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreProductUseCase(
          userRepositoy,
          findByCategoryUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductProvidersEnum.PRODUCT_REPOSITORY,
        CategoryProvidersEnum.FIND_BY_CATEGORY_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductProvidersEnum.UPDATE_PRODUCT_USE_CASE,
      useFactory: (
        userRepositoy: ProductRepositoryInterface,
        findByCategoryUseCase: FindByCategoryUseCaseInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateProductUseCase(
          userRepositoy,
          findByCategoryUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        ProductProvidersEnum.PRODUCT_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: ProductProvidersEnum.DELETE_PRODUCT_USE_CASE,
      useFactory: (
        userRepositoy: ProductRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteProductUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    ProductProvidersEnum.FIND_ALL_PRODUCTS_USE_CASE,
    ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
    ProductProvidersEnum.STORE_PRODUCT_USE_CASE,
    ProductProvidersEnum.UPDATE_PRODUCT_USE_CASE,
    ProductProvidersEnum.DELETE_PRODUCT_USE_CASE,
  ],
})
export class ProductModule {}
