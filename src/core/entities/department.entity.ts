// src/core/entities/department.entity.ts
import { Entity, Column, Unique, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Class } from './class.entity';
import { UserClassRole } from './user-class-role.entity';

@Entity('departments')
@Unique(['departmentName'])
@Unique(['departmentCode'])
export class Department extends BaseEntity {
  @Column({ name: 'department_name', type: 'varchar', length: 50, nullable: false })
  departmentName: string; // contoh: RPL, TKJ

  @Column({ name: 'department_code', type: 'varchar', length: 10, nullable: false })
  departmentCode: string; // contoh: RPL, TKJ

  @OneToMany(() => Class, cls => cls.department)
  classes: Class[];

  @OneToMany(() => UserClassRole, ucr => ucr.department)
  userClassRoles: UserClassRole[];
}
