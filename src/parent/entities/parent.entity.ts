import { Student } from 'src/student/entities/student.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('parent')
export class Parent {
  @PrimaryGeneratedColumn()
  id_parent: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'bytea' })
  password: Buffer;

  @Column({ type: 'text', nullable: true })
  recovery_code: string;

  @Column({ type: 'timestamptz', nullable: true })
  recovery_code_expires_at: Date;

  @Column({ type: 'text', nullable: true })
  access_token: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamptz', nullable: true })
  access_token_expires_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  refresh_token_expires_at: Date;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];

}