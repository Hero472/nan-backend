import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Parent } from '../../parent/entities/parent.entity';
import { LevelEnum } from '../../enum';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id_student: number;

  @ManyToOne(() => Parent)
  id_parent: Parent;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'enum', enum: LevelEnum })
  level: LevelEnum;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'bytea' })
  password: Buffer;

  @Column({ type: 'text', nullable: true })
  access_token: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamptz', nullable: true })
  access_token_expires_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  refresh_token_expires_at: Date;
}
