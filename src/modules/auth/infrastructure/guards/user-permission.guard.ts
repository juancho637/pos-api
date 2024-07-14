import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { PermissionType } from '@modules/permissions/domain';
import { META_PERMISSIONS } from '../decorators';

export class UserPermissionGuard implements CanActivate {
  private readonly context = UserPermissionGuard.name;

  constructor(
    private readonly reflector: Reflector,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const validPermissions = this.reflector.get<string[]>(
      META_PERMISSIONS,
      context.getHandler(),
    );

    if (!validPermissions || !validPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userPermissions = request.user.permissions as PermissionType[];

    const permissionsNames = userPermissions.map(
      (permission) => permission.name,
    );

    const hasPermission = validPermissions.some((permission) =>
      permissionsNames.includes(permission),
    );

    if (!hasPermission) {
      throw this.exception.forbiddenException({
        message: {
          codeError: 'TKN014',
          message: 'Forbidden',
        },
        context: this.context,
      });
    }

    return true;
  }
}
