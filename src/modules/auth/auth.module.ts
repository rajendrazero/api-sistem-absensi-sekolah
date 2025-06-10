import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from 'src/core/entities/user.entity';
import { Student } from 'src/core/entities/student.entity';
import { Role } from 'src/core/entities/role.entity';
import { UserRole } from 'src/core/entities/user-role.entity';
import { Class } from 'src/core/entities/class.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Student, Role, UserRole, Class]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
