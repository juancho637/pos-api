import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetAuthUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user.data;

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },
);
