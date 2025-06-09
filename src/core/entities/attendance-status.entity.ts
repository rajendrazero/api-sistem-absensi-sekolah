// src/core/entities/attendance-status.entity.ts
import { Entity, Column, Unique, OneToMany} from 'typeorm';
import { BaseEntity } from './base.entity';
import { AttendanceRecord } from './attendance-record.entity';

@Entity('attendance_statuses')
@Unique(['statusName'])
@Unique(['statusCode'])
export class AttendanceStatus extends BaseEntity {
  @Column({ name: 'status_name', type: 'varchar', length: 20, nullable: false })
  statusName: string; 

  @Column({ name: 'status_code', type: 'varchar', length: 4, nullable: false })
  statusCode: string; 

  @Column({ type: 'boolean', default: false, nullable: false })
  isPresent: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  requiresNote: boolean;
  
  @OneToMany(() => AttendanceRecord, record => record.status)
  attendanceRecords: AttendanceRecord[];
}
