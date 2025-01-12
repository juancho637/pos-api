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
import { ProviderProvidersEnum } from '@modules/providers/domain';
import { ProductModule } from '@modules/products/infrastructure';
import { ProviderModule } from '@modules/providers/infrastructure';
import { FindByProductStockUseCase } from '@modules/product-stocks/application';
import { FindByOrderUseCase } from '@modules/orders/application';

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
      provide: OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
      useClass: OrderDetailTypeOrmRepository,
    },
    {
      inject: [
        OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.FIND_ALL_ORDER_DETAILS_USE_CASE,
      useFactory: (
        orderDetailRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllOrderDetailsUseCase(
          orderDetailRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.FIND_BY_ORDER_DETAIL_USE_CASE,
      useFactory: (
        orderDetailRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByOrderDetailUseCase(
          orderDetailRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.STORE_ORDER_DETAIL_USE_CASE,
      useFactory: (
        orderDetailRepositoy: OrderDetailRepositoryInterface,
        findByProductStockUseCase: FindByProductStockUseCase,
        findByOrderUseCase: FindByOrderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreOrderDetailUseCase(
          orderDetailRepositoy,
          findByProductStockUseCase,
          findByOrderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
        ProductProvidersEnum.FIND_BY_PRODUCT_USE_CASE,
        ProviderProvidersEnum.FIND_BY_PROVIDER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.UPDATE_ORDER_DETAIL_USE_CASE,
      useFactory: (
        orderDetailRepositoy: OrderDetailRepositoryInterface,
        findByProductStockUseCase: FindByProductStockUseCase,
        findByOrderUseCase: FindByOrderUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new UpdateOrderDetailUseCase(
          orderDetailRepositoy,
          findByProductStockUseCase,
          findByOrderUseCase,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        OrderDetailProvidersEnum.ORDER_DETAIL_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderDetailProvidersEnum.DELETE_ORDER_DETAIL_USE_CASE,
      useFactory: (
        orderDetailRepositoy: OrderDetailRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteOrderDetailUseCase(
          orderDetailRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    OrderDetailProvidersEnum.FIND_ALL_ORDER_DETAILS_USE_CASE,
    OrderDetailProvidersEnum.FIND_BY_ORDER_DETAIL_USE_CASE,
    OrderDetailProvidersEnum.STORE_ORDER_DETAIL_USE_CASE,
    OrderDetailProvidersEnum.UPDATE_ORDER_DETAIL_USE_CASE,
    OrderDetailProvidersEnum.DELETE_ORDER_DETAIL_USE_CASE,
  ],
})
export class OrderDetailModule {}
