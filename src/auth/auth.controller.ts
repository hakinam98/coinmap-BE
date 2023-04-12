import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(@Body() { email, password }: LoginDto) {
    const auth = await this.authService.login(email, password);
    return {
      authToken: auth.authToken,
      user: new UserEntity(auth.user),
    };
  }

  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signUp(@Body() signUpDto: SignUpDto) {
    const auth = await this.authService.signUp(signUpDto);
    return {
      authToken: auth.authToken,
      user: new UserEntity(auth.user),
    };
  }
}
