import { HttpException } from '@nestjs/common';
import { InternalErrorMessageInterface } from '../../domain';

export class BaseCustomException extends HttpException {
  context: string;

  constructor(
    context: string,
    message: InternalErrorMessageInterface,
    status: number,
  ) {
    super(message, status);
    this.context = context;
  }
}
