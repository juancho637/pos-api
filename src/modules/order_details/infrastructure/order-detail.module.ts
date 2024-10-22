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
  OrderDetailProvidersEnum,
  OrderDetailRepositoryInterface,
} from '../domain';
import {
  DeleteOrderDetailUseCase,
  FindAllOrderDetailsUseCase,
  FindByOrderDetailUseCase,
  StoreOrderDetailUseCase,
  UpdateOrderDetailUseCase,
} from '../application';
import { OrderDetailEntity, OrderDetailTypeOrmRepository } from './persistence';
import {
  DeleteOrderDetailController,
  FindAllOrderDetailsController,
  FindByOrderDetailController,
  StoreOrderDetailController,
  UpdateOrderDetailController,
} from './api';
import { ProductProvidersEnum } from '@modules/products/domain';
import { FindByProductUseCase } from '@modules/products/application';
import { ProviderProvidersEnum } from '@modules/providers/domain';
import { FindByProviderUseCase } from '@modules/providers/application';
import { ProductModule } from '@modules/products/infrastructure';
import { ProviderModule } from '@modules/providers/infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetailEntity]),
    ProductModule,
    ProviderModule,
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [
    FindAllOrderDetailsController,
    FindByOrderDetailController,
    StoreOrderDetailController,
    UpdateOrderDetailController,
    DeleteOrderDetailController,
  ],
  providers: [
    {
      provide: OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
      useClass: OrderDetailTypeOrmRepository,
    },
    {
      inject: [
        OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.FIND_ALL_PRODUCT_STOCKS_USE_CASE,
      useFactory: (
        userRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllOrderDetailsUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.FIND_BY_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByOrderDetailUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.STORE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: OrderDetailRepositoryInterface,
        findByProductUseCase: FindByProductUseCase,
        findByProviderUseCase: FindByProviderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreOrderDetailUseCase(
          userRepositoy,
          findByProductUseCase,
          findByProviderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.UPDATE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: OrderDetailRepositoryInterface,
        findByProductUseCase: FindByProductUseCase,
        findByProviderUseCase: FindByProviderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateOrderDetailUseCase(
          userRepositoy,
          findByProductUseCase,
          findByProviderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.PRODUCT_STOCK_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.DELETE_PRODUCT_STOCK_USE_CASE,
      useFactory: (
        userRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteOrderDetailUseCase(
          userRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    OrderDetailProvidersEnum.FIND_ALL_PRODUCT_STOCKS_USE_CASE,
    OrderDetailProvidersEnum.FIND_BY_PRODUCT_STOCK_USE_CASE,
    OrderDetailProvidersEnum.STORE_PRODUCT_STOCK_USE_CASE,
    OrderDetailProvidersEnum.UPDATE_PRODUCT_STOCK_USE_CASE,
    OrderDetailProvidersEnum.DELETE_PRODUCT_STOCK_USE_CASE,
  ],
})
export class OrderDetailModule {}
