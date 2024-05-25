import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfigType,
  ConfigurationType,
} from '@common/adapters/configuration/domain';
import {
  ResponseInterceptor,
  LoggingInterceptor,
  AllExceptionFilter,
} from '@common/helpers/infrastructure';
import { LoggerProvidersEnum } from '@common/adapters/logger/domain';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerProvidersEnum.LOGGER_SERVICE);
  const configService = app.get(ConfigService<ConfigurationType>);
  const { port } = configService.get<AppConfigType>('app');

  app.useGlobalFilters(new AllExceptionFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port);

  logger.log({
    context: 'Bootstrap',
    message: `🚀 Server running on port: ${port}`,
  });
}

bootstrap();
