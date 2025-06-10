import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { User } from 'src/core/entities/user.entity';
import { Student } from 'src/core/entities/student.entity';
import { Role } from 'src/core/entities/role.entity';
import { UserRole } from 'src/core/entities/user-role.entity';
import { Class } from 'src/core/entities/class.entity';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt'; 
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  async registerSiswa(dto: RegisterDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const existUsername = await manager.findOne(User, { where: { username: dto.username } });
      if (existUsername) {
        throw new BadRequestException('Username sudah digunakan');
      }

      if (dto.email) {
        const existEmail = await manager.findOne(User, { where: { email: dto.email } });
        if (existEmail) {
          throw new BadRequestException('Email sudah digunakan');
        }
      }

      const kelas = await manager.findOne(Class, { where: { id: dto.classId } });
      if (!kelas) {
        throw new BadRequestException('Kelas tidak ditemukan');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

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

      const siswaRole = await manager.findOne(Role, { where: { roleName: 'Siswa' } });
      if (!siswaRole) {
        throw new BadRequestException('Role SISWA belum tersedia');
      }

      const userRole = manager.create(UserRole, {
        user,
        role: siswaRole,  
      });
      await manager.save(userRole);

      return user;
    });
  }

  async registerUmum(dto: RegisterDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const existUsername = await manager.findOne(User, { where: { username: dto.username } });
      if (existUsername) {
        throw new BadRequestException('Username sudah digunakan');
      }

      if (dto.email) {
        const existEmail = await manager.findOne(User, { where: { email: dto.email } });
        if (existEmail) {
          throw new BadRequestException('Email sudah digunakan');
        }
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = manager.create(User, {
        username: dto.username,
        passwordHash: hashedPassword,
        email: dto.email,
        fullName: dto.fullName,
      });
      await manager.save(user);

      const siswaRole = await manager.findOne(Role, { where: { roleName: 'Siswa' } });
      if (!siswaRole) {
        throw new BadRequestException('Role Siswa tidak ditemukan');
      }

      const userRole = manager.create(UserRole, {
        user,
        role: siswaRole,
      });
      await manager.save(userRole);

      return user;
    });
  }


  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userRepo.findOne({ where: { username }, relations: ['roles', 'roles.role'] });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // Ambil role dari user.roles
    const roles = user.roles?.map((ur) => ur.role.roleName) || [];

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  
}
