// data-source.ts
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as dotenv from 'dotenv';
dotenv.config();

import { AcademicPeriod } from './src/core/entities/academic-period.entity';
import { ActivityLog } from './src/core/entities/activity-log.entity';
import { AttendanceRecord } from './src/core/entities/attendance-record.entity';
import { AttendanceStatus } from './src/core/entities/attendance-status.entity';
import { ClassPosition } from './src/core/entities/class-position.entity';
import { Class as ClassEntity } from './src/core/entities/class.entity';
import { Department } from './src/core/entities/department.entity';
import { GradeLevel } from './src/core/entities/grade-level.entity';
import { HomeroomTeacher } from './src/core/entities/homeroom-teacher.entity';
import { Permission } from './src/core/entities/permission.entity';
import { QrCode } from './src/core/entities/qr-code.entity';
import { RolePermission } from './src/core/entities/role-permission.entity';
import { Role } from './src/core/entities/role.entity';
import { StudentPosition } from './src/core/entities/student-position.entity';
import { Student } from './src/core/entities/student.entity';
import { SystemSetting } from './src/core/entities/system-setting.entity';
import { Teacher } from './src/core/entities/teacher.entity';
import { UserClassRole } from './src/core/entities/user-class-role.entity';
import { UserRole } from './src/core/entities/user-role.entity';
import { User } from './src/core/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
  migrations: ['src/shared/database/migrations/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: true,
});
