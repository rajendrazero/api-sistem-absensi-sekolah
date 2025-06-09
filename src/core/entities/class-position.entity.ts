// src/core/entities/class-position.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StudentPosition } from './student-position.entity';

@Entity('class_positions')
export class ClassPosition extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  positionName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => StudentPosition, sp => sp.position)
  studentPositions: StudentPosition[];
}
