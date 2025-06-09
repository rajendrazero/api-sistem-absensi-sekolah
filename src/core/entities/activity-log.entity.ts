// src/core/entities/activity-log.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  
  export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';
  export type LogType = 'SYSTEM' | 'ATTENDANCE';
  
  @Entity('activity_logs')
  export class ActivityLog extends BaseEntity {
    @ManyToOne(() => User, (user) => user.activityLogs, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user?: User;
  
    @Column({ name: 'action_type', type: 'varchar', length: 50, nullable: false })
    actionType: ActionType;
  
    @Column({ name: 'log_type', type: 'varchar', length: 20, nullable: false })
    logType: LogType;
  
    @Column({ name: 'table_name', type: 'varchar', length: 50, nullable: true })
    tableName?: string;
  
    @Column({ name: 'record_id', type: 'uuid', nullable: true })
    recordId?: string;
  
    @Column({ name: 'old_values', type: 'jsonb', nullable: true })
    oldValues?: Record<string, any>;
  
    @Column({ name: 'new_values', type: 'jsonb', nullable: true })
    newValues?: Record<string, any>;
  
    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress?: string;
  
    @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
    userAgent?: string;
  }
  