import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseType } from 'src/interfaces/global.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/UserLogin.dto';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('User Management')
@UseGuards(AuthGuard('jwt'))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'User Login',
  })
  login(@Body() userLoginData: UserLoginDto): Promise<ResponseType> {
    return this.authService.login(userLoginData);
  }

  @Post('/register')
  @ApiOperation({
    summary: 'User Register',
  })
  register(@Body() userRegisterData: UserRegisterDto): Promise<ResponseType> {
    return this.authService.register(userRegisterData);
  }
}
