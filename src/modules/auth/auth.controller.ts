// src/modules/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-siswa')
  async registerSiswa(@Body() dto: RegisterDto) {
    const user = await this.authService.registerSiswa(dto);
    return {
      status: 'success',
      message: 'Pendaftaran siswa berhasil',
      data: {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
  
  @Post('register')
  async registerUmum(@Body() dto: RegisterDto) {
    const user = await this.authService.registerUmum(dto);
    return {
      status: 'success',
      message: 'Pendaftaran umum berhasil',
      data: {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
  

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const token = await this.authService.login(dto.username, dto.password);
    return {
      status: 'success',
      message: 'Login berhasil',
      data: token,
    };
  }

}
