import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id_attendance!: number;

  @ManyToOne(() => Student)
  id_student!: Student;

  @ManyToOne(() => Subject)
  id_subject!: Subject;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'boolean' })
  status!: boolean;
}