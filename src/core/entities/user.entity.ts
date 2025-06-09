// src/core/entities/user.entity.ts
import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ActivityLog } from './activity-log.entity';
import { UserRole } from './user-role.entity';
import { UserClassRole } from './user-class-role.entity';

@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  passwordHash: string;

  @Index({ unique: true, where: '"email" IS NOT NULL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  @OneToMany(() => ActivityLog, log => log.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserClassRole, ucr => ucr.user)
  userClassRoles: UserClassRole[];
}
