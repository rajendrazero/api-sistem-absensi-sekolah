// src/core/entities/role.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { RolePermission } from './role-permission.entity';
  import { UserClassRole } from './user-class-role.entity';
  import { UserRole } from './user-role.entity';

  @Entity('roles')
  export class Role extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
    roleName: string; // contoh: Siswa, Guru
  
    @ManyToOne(() => Role, (role) => role.children, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_role_id' })
    parent?: Role;
  
    @OneToMany(() => Role, (role) => role.parent)
    children?: Role[];
  
    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => RolePermission, rp => rp.role)
    rolePermissions: RolePermission[];

    @OneToMany(() => UserClassRole, ucr => ucr.role)
    userClassRoles: UserClassRole[];

    @OneToMany(() => UserRole, ur => ur.role)
    userRoles: UserRole[];
  }
  