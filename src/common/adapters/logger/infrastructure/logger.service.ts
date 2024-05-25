import { Injectable, Logger } from '@nestjs/common';
import { BaseCustomException } from '@common/adapters/exception/infrastructure';
import { LoggerServiceInterface, LoggerType } from '../domain';

@Injectable()
export class LoggerService extends Logger implements LoggerServiceInterface {
  debug({ message, context }: LoggerType) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(message, context);
    }
  }

  log({ message, context }: LoggerType) {
    super.log(message, context);
  }

  error({ message, trace, context }: LoggerType) {
    this.validateLoggerType(message, context) ||
      super.error(message, trace, context);
  }

  warn({ message, context }: LoggerType) {
    super.warn(message, context);
  }

  verbose({ message, context }: LoggerType) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(message, context);
    }
  }

  private validateLoggerType(
    error: BaseCustomException | string,
    context: string,
  ): boolean {
    return error instanceof BaseCustomException && error.context !== context;
  }
}
