import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionProtected } from './permission-protected.decorator';
import { JwtAuthGuard, UserPermissionGuard } from '../guards';

export function Auth(...roles: string[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, UserPermissionGuard),
    PermissionProtected(...roles),
  );
}
