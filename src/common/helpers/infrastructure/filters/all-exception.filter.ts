import { Request, Response } from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorInterface } from '../../domain';
import { LoggerService } from '@common/adapters/logger/infrastructure';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorInterface)
        : { message: (exception as Error).message, codeError: null };

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...message,
    };

    this.logMessage(
      `End Request for ${request.path}`,
      `method=${request.method} status=${status} codeError=${
        message.codeError ? message.codeError : null
      } message=${message.message ? message.message : null}`,
      status,
      // exception,
    );

    response.status(status).json(responseData);
  }

  private logMessage(
    context: string,
    message: string,
    status: number,
    // exception: Error,
  ) {
    if (status === 500) {
      this.logger.error({
        context,
        message,
        // trace: status >= 500 ? exception.stack : '',
      });
    } else {
      this.logger.warn({
        context,
        message,
      });
    }
  }
}
