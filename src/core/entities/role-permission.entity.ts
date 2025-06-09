// src/core/entities/role-permission.entity.ts
import {
    Entity,
    ManyToOne,
    JoinColumn,
    Unique
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { Role } from './role.entity';
  import { Permission } from './permission.entity';

  @Entity('role_permissions')
  @Unique(['role', 'permission'])
  export class RolePermission extends BaseEntity {
    @ManyToOne(() => Role, (role) => role.rolePermissions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;
  
    @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

  }
  