import { SetMetadata } from '@nestjs/common';

export const META_PERMISSIONS = 'permissions';

export const PermissionProtected = (...permissions: string[]) => {
  return SetMetadata(META_PERMISSIONS, permissions);
};
