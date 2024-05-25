import { Module } from '@nestjs/common';
import { ExceptionService } from './exception.service';
import { ExceptionProvidersEnum } from '../domain';

@Module({
  providers: [
    {
      provide: ExceptionProvidersEnum.EXCEPTION_SERVICE,
      useClass: ExceptionService,
    },
  ],
  exports: [ExceptionProvidersEnum.EXCEPTION_SERVICE],
})
export class ExceptionModule {}
