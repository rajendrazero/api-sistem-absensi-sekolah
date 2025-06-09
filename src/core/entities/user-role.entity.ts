// src/core/entities/user-role.entity.ts
import {
    Entity,
    ManyToOne,
    JoinColumn,
    Unique,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  import { Role } from './role.entity';
  
  @Entity('user_roles')
  @Unique(['user', 'role'])
  export class UserRole extends BaseEntity {
    @ManyToOne(() => User, (user) => user.userRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Role, (role) => role.userRoles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;
  }
  