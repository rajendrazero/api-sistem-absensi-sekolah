// src/core/entities/class.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Department } from './department.entity';
  import { GradeLevel } from './grade-level.entity';
  import { StudentPosition } from './student-position.entity';
  import { UserClassRole } from './user-class-role.entity';

  @Entity('classes')
  export class Class extends BaseEntity {
    @Column({ type: 'varchar', length: 20, nullable: false })
    className: string; // contoh: RPL1, TKJ2
  
    @ManyToOne(() => Department, (department) => department.classes, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'department_id' })
    department: Department;
  
    @ManyToOne(() => GradeLevel, (gradeLevel) => gradeLevel.classes, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'grade_level_id' })
    gradeLevel: GradeLevel;

    @OneToMany(() => StudentPosition, sp => sp.class)
    studentPositions: StudentPosition[];

    @OneToMany(() => UserClassRole, ucr => ucr.class)
    userClassRoles: UserClassRole[];
  }
  