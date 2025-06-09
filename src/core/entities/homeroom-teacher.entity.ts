// src/core/entities/homeroom-teacher.entity.ts
import {
    Entity,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Teacher } from './teacher.entity';
  import { Class } from './class.entity';
  import { AcademicPeriod } from './academic-period.entity';
  
  @Entity('homeroom_teachers')
  export class HomeroomTeacher extends BaseEntity {
    @ManyToOne(() => Teacher, (teacher) => teacher.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'teacher_id' })
    teacher: Teacher;
  
    @ManyToOne(() => Class, (cls) => cls.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'class_id' })
    class: Class;
  
    @ManyToOne(() => AcademicPeriod, (period) => period.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'period_id' })
    period: AcademicPeriod;
  }
  