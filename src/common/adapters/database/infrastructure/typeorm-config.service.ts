import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  ConfigurationType,
  DataBaseConfigType,
  TypeOrmConfigType,
} from '@common/adapters/configuration/domain';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<ConfigurationType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.get<DataBaseConfigType>('database');
    const typeOrm = this.configService.get<TypeOrmConfigType>('typeOrm');
    const config = {
      type: database.type,
      logging: typeOrm.logging,
      synchronize: typeOrm.synchronize,
      autoLoadEntities: true,
      entities: [
        join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'modules',
          '**',
          '*.entity.{ts,js}',
        ),
      ],
    };

    if (database.type === 'sqlite') {
      config['database'] = join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'database',
        'database.sqlite',
      );
    } else {
      config['host'] = database.host;
      config['port'] = database.port;
      config['username'] = database.username;
      config['password'] = database.password;
      config['database'] = database.database;
    }

    return config;
  }
}
