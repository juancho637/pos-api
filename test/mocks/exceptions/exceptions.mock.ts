import { FormatExceptionMessageInterface } from '@common/adapters/exception/domain';
import { InternalServerErrorCustomException } from '@common/adapters/exception/infrastructure';

export const internalServerErrorExceptionMock = (
  data: FormatExceptionMessageInterface,
) => {
  return new InternalServerErrorCustomException(data.context, data.message);
};
