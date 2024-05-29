import { Module } from '@nestjs/common';
import { HashModule } from '@common/adapters/hash/infrastructure';
import { ConfigurationModule } from '@common/adapters/configuration/infrastructure';
import { DatabaseModule } from '@common/adapters/database/infrastructure';
import { LoggerModule } from '@common/adapters/logger/infrastructure';
import { ExceptionModule } from '@common/adapters/exception/infrastructure';
import { UserModule } from '@modules/users/infrastructure';
import { ProviderModule } from '@modules/providers/infrastructure';

@Module({
  imports: [
    // Common
    ConfigurationModule,
    DatabaseModule,
    LoggerModule,
    ExceptionModule,
    HashModule,

    // Modules
    UserModule,
    ProviderModule,
  ],
})
export class AppModule {}
