// src/core/entities/system-setting.entity.ts
import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { BaseEntity } from './base.entity';
  import { User } from './user.entity';
  
  @Entity('system_settings')
  export class SystemSetting extends BaseEntity {
    @Index({ unique: true })
    @Column({ name: 'setting_key', type: 'varchar', length: 100, nullable: false })
    settingKey: string;
  
    @Column({ name: 'setting_value', type: 'text', nullable: false })
    settingValue: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updatedBy?: User;
  }
  