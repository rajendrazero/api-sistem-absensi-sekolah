// src/core/entities/attendance-record.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Student } from './student.entity';
  import { AttendanceStatus } from './attendance-status.entity';
  import { User } from './user.entity';
  
  @Entity('attendance_records')
  export class AttendanceRecord extends BaseEntity {
    @ManyToOne(() => Student, (student) => student.attendanceRecords, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Student;
  
    @ManyToOne(() => AttendanceStatus, (status) => status.attendanceRecords, { nullable: false })
    @JoinColumn({ name: 'status_id' })
    status: AttendanceStatus;
  
    @Column({ name: 'record_date', type: 'date', nullable: false })
    recordDate: string; // ISO date string (YYYY-MM-DD)
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'recorded_by' })
    recordedBy?: User;
  
    @Column({ type: 'text', nullable: true })
    note?: string;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updatedBy?: User;
  
    @Column({
      type: 'geography',
      spatialFeatureType: 'Point',
      srid: 4326,
      nullable: true,
    })
    location?: string; // stored as WKT Point, or GeoJSON depending on usage
  }
  