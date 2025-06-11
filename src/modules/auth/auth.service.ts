import * as bcrypt from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/core/entities/user.entity';
import { Student } from 'src/core/entities/student.entity';
import { Role } from 'src/core/entities/role.entity';
import { UserRole } from 'src/core/entities/user-role.entity';
import { Class } from 'src/core/entities/class.entity';

import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async validateUsernameEmail(manager: any, username: string, email?: string) {
    const existingUsername = await manager.findOne(User, { where: { username } });
    if (existingUsername) {
      throw new BadRequestException('Username sudah digunakan');
    }

    if (email) {
      const existingEmail = await manager.findOne(User, { where: { email } });
      if (existingEmail) {
        throw new BadRequestException('Email sudah digunakan');
      }
    }
  }

  private async assignRole(manager: any, user: User, roleName: string) {
    const role = await manager.findOne(Role, { where: { roleName } });
    if (!role) throw new BadRequestException(`Role ${roleName} belum tersedia`);

    const userRole = manager.create(UserRole, { user, role });
    await manager.save(userRole);
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
  
      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
        relations: ['userRoles', 'userRoles.role'],
      });
  
      if (!user) {
        throw new UnauthorizedException('Pengguna tidak ditemukan');
      }
  
      const roles = user.userRoles?.map((ur) => ur.role.roleName) || [];
  
      const newPayload = {
        sub: user.id,
        username: user.username,
        roles,
      };
  
      const accessExpiresIn = this.configService.get<string>('jwt.expiresIn');
  
      const access_token = await this.jwtService.signAsync(newPayload, {
        expiresIn: accessExpiresIn,
      });
  
      return { access_token };
    } catch (err) {
      throw new UnauthorizedException('Refresh token tidak valid atau sudah kedaluwarsa');
    }
  }
  

  async registerSiswa(dto: RegisterDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      await this.validateUsernameEmail(manager, dto.username, dto.email);

      const kelas = await manager.findOne(Class, { where: { id: dto.classId } });
      if (!kelas) throw new BadRequestException('Kelas tidak ditemukan');

      const hashedPassword = await this.hashPassword(dto.password);
      const user = manager.create(User, {
        username: dto.username,
        passwordHash: hashedPassword,
        email: dto.email,
        fullName: dto.fullName,
      });
      await manager.save(user);

      const student = manager.create(Student, {
        nis: dto.nis,
        nisn: dto.nisn,
        class: kelas,
        user,
      });
      await manager.save(student);

      await this.assignRole(manager, user, 'Siswa');

      return user;
    });
  }

  async registerUmum(dto: RegisterDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      await this.validateUsernameEmail(manager, dto.username, dto.email);

      const hashedPassword = await this.hashPassword(dto.password);
      const user = manager.create(User, {
        username: dto.username,
        passwordHash: hashedPassword,
        email: dto.email,
        fullName: dto.fullName,
      });
      await manager.save(user);

      await this.assignRole(manager, user, 'Siswa');

      return user;
    });
  }

  async login(username: string, password: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['userRoles', 'userRoles.role'],
    });
  
    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }
  
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }
  
    const roles = user.userRoles?.map((ur) => ur.role.roleName) || [];
  
    const payload = {
      sub: user.id,
      username: user.username,
      roles,
    };
  
    const accessExpiresIn = this.configService.get<string>('jwt.expiresIn');
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn');
  
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: accessExpiresIn,
    });
  
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: refreshExpiresIn,
    });
  
    return { access_token, refresh_token };
  }
  
  
}
