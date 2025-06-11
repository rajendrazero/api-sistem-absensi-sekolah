import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { RegisterSiswaDto } from './dto/register-siswa.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
@Post('refresh')
async refresh(@Body() dto: RefreshTokenDto) {
  return await this.authService.refreshToken(dto.refresh_token);
}

@Public()
@Post('register-siswa')
async registerSiswa(@Body() dto: RegisterSiswaDto) {
  const user = await this.authService.registerSiswa(dto);
  return {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
  };
}

@Public()
@Post('register')
async registerUmum(@Body() dto: RegisterDto) {
  const user = await this.authService.registerUmum(dto);
  return {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
  };
}

@Public()
@Post('login')
async login(@Body() dto: LoginDto) {
  return await this.authService.login(dto.username, dto.password);
}

}
