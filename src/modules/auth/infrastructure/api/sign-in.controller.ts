import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthUseCasesEnum } from '../../domain';
import { SignInUseCase } from '../../application';
import { SignInDto } from '../dto';

@Controller()
export class SignInController {
  constructor(
    @Inject(AuthUseCasesEnum.SIGN_IN_USE_CASE)
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('api/auth/sign-in')
  async run(@Body() signInDto: SignInDto) {
    return await this.signInUseCase.run(signInDto);
  }
}
