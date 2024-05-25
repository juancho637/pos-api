import { HttpException, Injectable } from '@nestjs/common';
import {
  ExceptionServiceInterface,
  FormatExceptionMessageInterface,
} from '../domain';
import {
  BadRequestCustomException,
  ForbiddenCustomException,
  InternalServerErrorCustomException,
  UnauthorizedCustomException,
} from './custom-exceptions';

@Injectable()
export class ExceptionService implements ExceptionServiceInterface {
  badRequestException({
    message,
    context,
    error,
  }: FormatExceptionMessageInterface): Error {
    return (
      this.validateErrorType(error) ||
      new BadRequestCustomException(context, message)
    );
  }

  internalServerErrorException({
    message,
    context,
    error,
  }: FormatExceptionMessageInterface): Error {
    return (
      this.validateErrorType(error) ||
      new InternalServerErrorCustomException(context, message)
    );
  }

  forbiddenException({
    message,
    context,
    error,
  }: FormatExceptionMessageInterface): Error {
    return (
      this.validateErrorType(error) ||
      new ForbiddenCustomException(context, message)
    );
  }

  UnauthorizedException({
    message,
    context,
    error,
  }: FormatExceptionMessageInterface): Error {
    return (
      this.validateErrorType(error) ||
      new UnauthorizedCustomException(context, message)
    );
  }

  private validateErrorType(error: Error): Error {
    return error instanceof HttpException && error;
  }
}
