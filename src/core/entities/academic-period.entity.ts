// src/core/entities/academic-period.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('academic_periods')
export class AcademicPeriod extends BaseEntity {
  @Column({ name: 'academic_year', type: 'varchar', length: 9, nullable: false })
  academicYear: string;  

  @Column({ type: 'smallint', nullable: false })
  semester: number; 

  @Column({ name: 'start_date', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: false })
  endDate: Date;
}
