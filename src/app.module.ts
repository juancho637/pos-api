import { Module } from '@nestjs/common';
import { HashModule } from '@common/adapters/hash/infrastructure';
import { ConfigurationModule } from '@common/adapters/configuration/infrastructure';
import { DatabaseModule } from '@common/adapters/database/infrastructure';
import { LoggerModule } from '@common/adapters/logger/infrastructure';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import { TokenModule } from '@common/adapters/token/infrastructure';
import { UserModule } from '@modules/users/infrastructure';
import { ProviderModule } from '@modules/providers/infrastructure';
import { AuthModule } from '@modules/auth/infrastructure';
import { CustomerModule } from '@modules/customers/infrastructure';
import { CategoryModule } from '@modules/categories/infrastructure';
import { CounterModule } from './modules/counters/infrastructure';

@Module({
  imports: [
    // Common
    ConfigurationModule,
    DatabaseModule,
    LoggerModule,
    ExceptionModule,
    HashModule,
    TokenModule,

    // Modules
    UserModule,
    ProviderModule,
    AuthModule,
    CustomerModule,
    CategoryModule,
    CounterModule,
  ],
})
export class AppModule {}
