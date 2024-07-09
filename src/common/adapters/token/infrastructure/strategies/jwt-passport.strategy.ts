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

export class JwtPassportStrategy extends PassportStrategy(Strategy) {
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
      const user = await this.findByUserUseCase.run({
        id: sub as number,
      });

      if (!user) {
        throw this.exception.UnauthorizedException({
          message: {
            codeError: 'TKN012',
            message: 'User not found',
          },
          context: this.context,
        });
      }

      if (user.deletedAt) {
        throw this.exception.UnauthorizedException({
          message: {
            codeError: 'TKN013',
            message: 'User was deleted',
          },
          context: this.context,
        });
      }

      return user;
    } catch (error) {
      this.logger.error({
        message: error,
        context: this.context,
      });

      throw error;
    }
  }
}
