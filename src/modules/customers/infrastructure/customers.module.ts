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
import { CustomerProvidersEnum, CustomerRepositoryInterface } from '../domain';
import {
  FindAllCustomersUseCase,
  FindByCustomerUseCase,
  DeleteCustomerUseCase,
  StoreCustomerUseCase,
  // UpdateCustomerUseCase,
} from '../application';
import { CustomerEntity, CustomerTypeOrmRepository } from './persistence';
import {
  FindAllCustomersController,
  DeleteCustomerController,
  FindByCustomerController,
  StoreCustomerController,
  // UpdateCustomerController,
} from './api';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    LoggerModule,
    ExceptionModule,
  ],
  controllers: [
    FindAllCustomersController,
    FindByCustomerController,
    StoreCustomerController,
    // UpdateCustomerController,
    DeleteCustomerController,
  ],
  providers: [
    {
      provide: CustomerProvidersEnum.CUSTOMER_REPOSITORY,
      useClass: CustomerTypeOrmRepository,
    },
    {
      inject: [
        CustomerProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CustomerProvidersEnum.FIND_ALL_CUSTOMERS_USE_CASE,
      useFactory: (
        customerRepositoy: CustomerRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindAllCustomersUseCase(
          customerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CustomerProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CustomerProvidersEnum.FIND_BY_CUSTOMER_USE_CASE,
      useFactory: (
        customerRepositoy: CustomerRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new FindByCustomerUseCase(
          customerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    {
      inject: [
        CustomerProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CustomerProvidersEnum.STORE_CUSTOMER_USE_CASE,
      useFactory: (
        customerRepositoy: CustomerRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new StoreCustomerUseCase(
          customerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
    // {
    //   inject: [
    //     CustomerProvidersEnum.CUSTOMER_REPOSITORY,
    //     LoggerProvidersEnum.LOGGER_SERVICE,
    //     ExceptionProvidersEnum.EXCEPTION_SERVICE,
    //   ],
    //   provide: CustomerProvidersEnum.UPDATE_CUSTOMER_USE_CASE,
    //   useFactory: (
    //     customerRepositoy: CustomerRepositoryInterface,
    //     loggerService: LoggerServiceInterface,
    //     exceptionService: ExceptionServiceInterface,
    //   ) =>
    //     new UpdateCustomerUseCase(
    //       customerRepositoy,
    //       loggerService,
    //       exceptionService,
    //     ),
    // },
    {
      inject: [
        CustomerProvidersEnum.CUSTOMER_REPOSITORY,
        LoggerProvidersEnum.LOGGER_SERVICE,
        ExceptionProvidersEnum.EXCEPTION_SERVICE,
      ],
      provide: CustomerProvidersEnum.DELETE_CUSTOMER_USE_CASE,
      useFactory: (
        customerRepositoy: CustomerRepositoryInterface,
        loggerService: LoggerServiceInterface,
        exceptionService: ExceptionServiceInterface,
      ) =>
        new DeleteCustomerUseCase(
          customerRepositoy,
          loggerService,
          exceptionService,
        ),
    },
  ],
  exports: [
    CustomerProvidersEnum.FIND_ALL_CUSTOMERS_USE_CASE,
    CustomerProvidersEnum.FIND_BY_CUSTOMER_USE_CASE,
    CustomerProvidersEnum.STORE_CUSTOMER_USE_CASE,
    // CustomerProvidersEnum.UPDATE_CUSTOMER_USE_CASE,
    // CustomerProvidersEnum.DELETE_CUSTOMER_USE_CASE,
  ],
})
export class CustomerModule {}
