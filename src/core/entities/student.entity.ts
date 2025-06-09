// src/core/entities/student.entity.ts
import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    Unique,
    OneToMany
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  import { Class } from './class.entity'; // Asumsi ada entity Class
  import { AttendanceRecord } from './attendance-record.entity';
  import { QrCode } from './qr-code.entity';
  import { StudentPosition } from './student-position.entity';

  @Entity('students')
  @Unique(['user'])
  export class Student extends BaseEntity {
    @Index({ unique: true, where: '"nis" IS NOT NULL' })
    @Column({ type: 'varchar', length: 20, nullable: true })
    nis?: string;
  
    @Index({ unique: true, where: '"nisn" IS NOT NULL' })
    @Column({ type: 'varchar', length: 20, nullable: true })
    nisn?: string;
  
    @Column({ type: 'boolean', default: true, nullable: false })
    isActive: boolean;
  
    // Relasi ke User
    @ManyToOne(() => User, (user) => user.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    // Relasi ke Class
    @ManyToOne(() => Class, (cls) => cls.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'class_id' })
    class: Class;

    @OneToMany(() => AttendanceRecord, record => record.student)
    attendanceRecords: AttendanceRecord[];

    @OneToMany(() => QrCode, qr => qr.student)
    qrCodes: QrCode[];

    @OneToMany(() => StudentPosition, sp => sp.student)
    studentPositions: StudentPosition[];
  }
  