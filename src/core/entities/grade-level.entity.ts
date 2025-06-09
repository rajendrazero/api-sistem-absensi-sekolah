// src/core/entities/grade-level.entity.ts
import { Entity, Column, Unique, Check, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Class } from './class.entity';
import { UserClassRole } from './user-class-role.entity';

@Entity('grade_levels')
@Unique(['levelName']) // gunakan nama kolom
@Unique(['levelOrder']) // gunakan nama kolom
@Check(`"level_order" BETWEEN 1 AND 3`) // gunakan nama kolom
export class GradeLevel extends BaseEntity {
  @Column({ name: 'level_name', type: 'varchar', length: 3, nullable: false })
  levelName: string;

  @Column({ name: 'level_order', type: 'smallint', nullable: false })
  levelOrder: number;

  @OneToMany(() => Class, cls => cls.gradeLevel)
  classes: Class[];

  @OneToMany(() => UserClassRole, ucr => ucr.gradeLevel)
  userClassRoles: UserClassRole[];
}
