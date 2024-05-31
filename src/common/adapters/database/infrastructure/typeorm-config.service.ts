import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  ConfigurationType,
  DataBaseConfigType,
  TypeOrmConfigType,
} from '@common/adapters/configuration/domain';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<ConfigurationType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.get<DataBaseConfigType>('database');
    const typeOrm = this.configService.get<TypeOrmConfigType>('typeOrm');

    return {
      type: database.type,
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.database,
      logging: typeOrm.logging,
      synchronize: typeOrm.synchronize,
      entities: [
        join(
          __dirname,
          '../',
          '../',
          '../',
          '../',
          'modules',
          '**',
          '*.entity.{ts,js}',
        ),
      ],
      autoLoadEntities: true,
    };
  }
}
