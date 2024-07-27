import { LoggerServiceInterface } from '@common/adapters/logger/domain';
import { UserPermissionsEnum } from '@modules/users/domain';
import { RolePermissionsEnum } from '@modules/roles/domain';
import { PermissionRepositoryInterface, PermissionType } from '../../domain';

export class PermissionsSeeder {
  private readonly context = PermissionsSeeder.name;

  constructor(
    private readonly permissionRepository: PermissionRepositoryInterface,
    private readonly logger: LoggerServiceInterface,
  ) {}

  async seed(): Promise<PermissionType[]> {
    const userPermissions = this.enumToArray(UserPermissionsEnum, 'users');
    const rolePermissions = this.enumToArray(RolePermissionsEnum, 'roles');

    const permissions = await this.permissionRepository.store([
      ...userPermissions,
      ...rolePermissions,
    ]);

    this.logger.debug({
      message: 'Development permissions seeded',
      context: this.context,
    });

    return permissions as PermissionType[];
  }

  private enumToArray<T>(enumObject: T, module: string) {
    return Object.keys(enumObject).map((key) => ({
      name: enumObject[key],
      module,
    }));
  }
}
