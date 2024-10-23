import { Subject } from '../../subject/entities/subject.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('professor')
export class Professor {
  @PrimaryGeneratedColumn()
  id_professor!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

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

  @OneToMany(() => Subject, (subject) => subject.professor)
  subjects!: Subject[];
}