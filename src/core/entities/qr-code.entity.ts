// src/core/entities/qr-code.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Student } from './student.entity';
  
  @Entity('qr_codes')
  export class QrCode extends BaseEntity {
    @Index({ unique: true })
    @Column({ name: 'qr_token', type: 'varchar', length: 100, nullable: false })
    qrToken: string;
  
    @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
    isActive: boolean;
  
    @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
    expiresAt?: Date;
  
    @ManyToOne(() => Student, (student) => student.qrCodes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Student;
  }
  