import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ConfigurationType,
  JwtConfigType,
} from '@common/adapters/configuration/domain';
import {
  FindByUserUseCaseInterface,
  UserProvidersEnum,
} from '@modules/users/domain';
import {
  LoggerProvidersEnum,
  LoggerServiceInterface,
} from '@common/adapters/logger/domain';
import {
  ExceptionProvidersEnum,
  ExceptionServiceInterface,
} from '@common/adapters/exception/domain';
import { TokenPayloadType } from '../../domain';
import { PermissionType } from '@modules/permissions/domain';
import { RoleType } from '@modules/roles/domain';

export class JwtPassportStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly context = JwtPassportStrategy.name;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<ConfigurationType>,
    @Inject(UserProvidersEnum.FIND_BY_USER_USE_CASE)
    private readonly findByUserUseCase: FindByUserUseCaseInterface,
    @Inject(LoggerProvidersEnum.LOGGER_SERVICE)
    private readonly logger: LoggerServiceInterface,
    @Inject(ExceptionProvidersEnum.EXCEPTION_SERVICE)
    private readonly exception: ExceptionServiceInterface,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<JwtConfigType>('jwt').jwtSecret,
    });
  }

  async validate({ sub }: TokenPayloadType) {
    try {
      const { roles, permissions, ...userData } =
        await this.findByUserUseCase.run(
          {
            id: sub as number,
          },
          ['roles.permissions', 'permissions'],
        );

      if (!userData) {
        throw this.exception.UnauthorizedException({
          message: {
            codeError: 'TKN012',
            message: 'User not found',
          },
          context: this.context,
        });
      }

      if (userData.deletedAt) {
        throw this.exception.UnauthorizedException({
          message: {
            codeError: 'TKN013',
            message: 'User was deleted',
          },
          context: this.context,
        });
      }

      const userPermissions = this.getUniquePermissions(roles, permissions);

      return { data: userData, permissions: userPermissions };
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw error;
    }
  }

  private getUniquePermissions(
    roles: RoleType[],
    permissions: PermissionType[],
  ): PermissionType[] {
    const rolesPermissions = roles.reduce(
      (acc, role) => [...acc, ...role.permissions],
      [],
    );

    const mergedPermissions = [...permissions, ...rolesPermissions];

    const uniqueEntitiesMap = new Map<number, PermissionType>();

    mergedPermissions.forEach((entity) => {
      uniqueEntitiesMap.set(entity.id, entity);
    });

    return Array.from(uniqueEntitiesMap.values());
  }
}
