import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  ConfigurationType,
  DataBaseConfigType,
} from '@common/adapters/configuration/domain';
import { GetDatabaseConnectionFactory } from '../application';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private configService: ConfigService<ConfigurationType>,
    private getDatabaseConnectionFactory: GetDatabaseConnectionFactory,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.get<DataBaseConfigType>('database');

    return this.getDatabaseConnectionFactory
      .run(database.type)
      .createTypeOrmOptions();
  }
}
