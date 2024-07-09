import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfigurationModule,
  ConfigurationService,
} from '@common/adapters/configuration/infrastructure';
import {
  GetDatabaseConnectionFactory,
  PostgresConfigStrategy,
  SqliteConfigStrategy,
} from '../application';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      extraProviders: [
        GetDatabaseConnectionFactory,
        SqliteConfigStrategy,
        PostgresConfigStrategy,
      ],
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class DatabaseModule {}
