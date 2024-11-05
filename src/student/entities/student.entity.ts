import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Parent } from '../../parent/entities/parent.entity';
import { LevelEnum } from '../../enum';
import { IsNotEmpty } from 'class-validator';
import { Grade } from 'src/grade/entities/grade.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id_student!: number;

  @IsNotEmpty()
  @Column({ type: 'text' })
  name!: string;

  @IsNotEmpty()
  @Column({ type: 'enum', enum: LevelEnum })
  level!: LevelEnum;

  @IsNotEmpty()
  @Column({ type: 'text', unique: true })
  email!: string;

  @IsNotEmpty()
  @Column({ type: 'bytea' })
  password!: Buffer;

  @Column({ type: 'text', nullable: true })
  recovery_code: string | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  recovery_code_expires_at: Date | null = null;

  @Column({ type: 'text', nullable: true })
  access_token: string | null = null;

  @Column({ type: 'text', nullable: true })
  refresh_token: string | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  access_token_expires_at: Date | null = null;

  @Column({ type: 'timestamptz', nullable: true })
  refresh_token_expires_at: Date | null = null;

  @ManyToOne(() => Parent, (parent) => parent.students)
  parent!: Parent;

  @OneToMany(() => Grade, (grade) => grade.student)
  grades!: Grade[];
}
