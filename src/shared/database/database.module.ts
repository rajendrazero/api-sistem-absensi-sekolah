import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
  
import { AcademicPeriod } from '@entities/academic-period.entity';
import { ActivityLog } from '@entities/activity-log.entity';
import { AttendanceRecord } from '@entities/attendance-record.entity';
import { AttendanceStatus } from '@entities/attendance-status.entity';
import { ClassPosition } from '@entities/class-position.entity';
import { Class as ClassEntity } from '@entities/class.entity'; 
import { Department } from '@entities/department.entity';
import { GradeLevel } from '@entities/grade-level.entity';
import { HomeroomTeacher } from '@entities/homeroom-teacher.entity';
import { Permission } from '@entities/permission.entity';
import { QrCode } from '@entities/qr-code.entity';
import { RolePermission } from '@entities/role-permission.entity';
import { Role } from '@entities/role.entity';
import { StudentPosition } from '@entities/student-position.entity';
import { Student } from '@entities/student.entity';
import { SystemSetting } from '@entities/system-setting.entity';
import { Teacher } from '@entities/teacher.entity';
import { UserClassRole } from '@entities/user-class-role.entity';
import { UserRole } from '@entities/user-role.entity';
import { User } from '@entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [
          AcademicPeriod,
          ActivityLog,
          AttendanceRecord,
          AttendanceStatus,
          ClassPosition,
          ClassEntity,
          Department, 
          GradeLevel,
          HomeroomTeacher,
          Permission,
          QrCode,
          RolePermission,
          Role,
          StudentPosition,
          Student,
          SystemSetting,
          Teacher,
          UserClassRole,
          UserRole,
          User,
        ],
        synchronize: config.get('nodeEnv') === 'development',
        logging: config.get('nodeEnv') === 'development',
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}
