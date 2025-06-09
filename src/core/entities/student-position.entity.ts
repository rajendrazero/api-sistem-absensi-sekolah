// src/core/entities/student-position.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Student } from './student.entity';
  import { ClassPosition } from './class-position.entity';
  import { Class } from './class.entity';
  
  @Entity('student_positions')
  export class StudentPosition extends BaseEntity {
    @Column({ type: 'date' })
    startDate: string;  // DATE type, gunakan string 'YYYY-MM-DD'
  
    @Column({ type: 'date', nullable: true })
    endDate?: string;
  
    // Relasi ke Student
    @ManyToOne(() => Student, (student) => student.studentPositions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Student;
  
    // Relasi ke ClassPosition
    @ManyToOne(() => ClassPosition, (position) => position.studentPositions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'position_id' })
    position: ClassPosition;
  
    // Relasi ke Class
    @ManyToOne(() => Class, (cls) => cls.studentPositions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'class_id' })
    class: Class;
  }
  