import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  ConfigurationModule,
  ConfigurationService,
} from '@common/adapters/configuration/infrastructure';
import { TokenProvidersEnum } from '../domain';
import { JwtConfigService } from './jwt-config.service';
import { TokenJwtService } from './token-jwt.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    {
      provide: TokenProvidersEnum.TOKEN_SERVICE,
      useClass: TokenJwtService,
    },
  ],
  exports: [TokenProvidersEnum.TOKEN_SERVICE],
})
export class TokenModule {}
