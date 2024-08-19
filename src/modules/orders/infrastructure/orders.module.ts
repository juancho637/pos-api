import { forwardRef, Module } from '@nestjs/common';
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
import { CounterProvidersEnum } from '@modules/counters/domain';
import { FindByCounterUseCase } from '@modules/counters/application';
import { CounterModule } from '@modules/counters/infrastructure';
import { CustomerProvidersEnum } from '@modules/customers/domain';
import { FindByCustomerUseCase } from '@modules/customers/application';
import { CustomerModule } from '@modules/customers/infrastructure';
import { OrderProvidersEnum, OrderRepositoryInterface } from '../domain';
import {
  //   FindAllOrdersUseCase,
  //   FindByOrderUseCase,
  StoreOrderUseCase,
  //   UpdateOrderUseCase,
} from '../application';
import {
  //   FindAllOrdersController,
  //   FindByOrderController,
  StoreOrderController,
  //   UpdateOrderController,
} from './api';
import { OrderEntity, OrderTypeOrmRepository } from './persistence';
// import { OrdersSeeder } from './seeders';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    LoggerModule,
    ExceptionModule,
    CounterModule,
    forwardRef(() => CustomerModule),
  ],
  controllers: [
    // FindAllOrdersController,
    // FindByOrderController,
    StoreOrderController,
    // UpdateOrderController,
  ],
  providers: [
    {
      provide: OrderProvidersEnum.ORDER_REPOSITORY,
      useClass: OrderTypeOrmRepository,
    },
    // {
    //   provide: OrderProvidersEnum.ORDER_SEEDER,
    //   inject: [
    //     OrderProvidersEnum.ORDER_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //   ],
    //   useFactory: (
    //     orderRepositoy: OrderRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //   ) => new OrdersSeeder(orderRepositoy, loggerService),
    // },
    // {
    //   inject: [
    //     OrderProvidersEnum.ORDER_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: OrderProvidersEnum.FIND_ALL_ORDERS_USE_CASE,
    //   useFactory: (
    //     orderRepositoy: OrderRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new FindAllOrdersUseCase(
    //       orderRepositoy,
    //       loggerService,
    //       exceptionService,
    //     ),
    // },
    // {
    //   inject: [
    //     OrderProvidersEnum.ORDER_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: OrderProvidersEnum.FIND_BY_ORDER_USE_CASE,
    //   useFactory: (
    //     orderRepositoy: OrderRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new FindByOrderUseCase(orderRepositoy, loggerService, exceptionService),
    // },
    {
      inject: [
        OrderProvidersEnum.ORDER_REPOSITORY,
        CounterProvidersEnum.FIND_BY_COUNTER_USE_CASE,
        CustomerProvidersEnum.FIND_BY_CUSTOMER_USE_CASE,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: OrderProvidersEnum.STORE_ORDER_USE_CASE,
      useFactory: (
        orderRepositoy: OrderRepositoryInterface,
        findByCounterUseCase: FindByCounterUseCase,
        findByCustomerUseCase: FindByCustomerUseCase,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreOrderUseCase(
          orderRepositoy,
          findByCounterUseCase,
          findByCustomerUseCase,
          loggerService,
          exceptionService,
        ),
    },
    // {
    //   inject: [
    //     OrderProvidersEnum.ORDER_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: OrderProvidersEnum.UPDATE_ORDER_USE_CASE,
    //   useFactory: (
    //     orderRepositoy: OrderRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new UpdateOrderUseCase(orderRepositoy, loggerService, exceptionService),
    // },
  ],
  exports: [
    // OrderProvidersEnum.FIND_ALL_ORDERS_USE_CASE,
    // OrderProvidersEnum.FIND_BY_ORDER_USE_CASE,
    OrderProvidersEnum.STORE_ORDER_USE_CASE,
    // OrderProvidersEnum.UPDATE_ORDER_USE_CASE,
  ],
})
export class OrderModule {}