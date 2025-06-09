// src/core/entities/teacher.entity.ts
import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    Unique,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  
  @Entity('teachers')
  @Unique(['user'])
  export class Teacher extends BaseEntity {
    @Index({ unique: true, where: '"nip" IS NOT NULL' })
    @Column({ type: 'varchar', length: 20, nullable: true })
    nip?: string;
  
    @Column({ type: 'boolean', default: false, nullable: false })
    isHomeroom: boolean;
  
    @Column({ type: 'boolean', default: true, nullable: false })
    isActive: boolean;
  
    // Relasi ke User (unik dan wajib)
    @ManyToOne(() => User, (user) => user.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;
  }
  