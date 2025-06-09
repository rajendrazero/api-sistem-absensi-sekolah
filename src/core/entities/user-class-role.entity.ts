// src/core/entities/user-class-role.entity.ts
import {
    Entity,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  import { Role } from './role.entity';
  import { Class } from './class.entity';
  import { Department } from './department.entity';
  import { GradeLevel } from './grade-level.entity';

  @Entity('user_class_roles')
  export class UserClassRole extends BaseEntity {
    @ManyToOne(() => User, (user) => user.userClassRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Role, (role) => role.userClassRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;
  
    @ManyToOne(() => Class, (klass) => klass.userClassRoles, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'class_id' })
    class?: Class;
  
    @ManyToOne(() => Department, (department) => department.userClassRoles, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'department_id' })
    department?: Department;
  
    @ManyToOne(() => GradeLevel, (gradeLevel) => gradeLevel.userClassRoles, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'grade_level_id' })
    gradeLevel?: GradeLevel;

  }
  