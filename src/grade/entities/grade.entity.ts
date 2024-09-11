import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('grade')
export class Grade {
  @PrimaryGeneratedColumn()
  id_grade: number;

  @ManyToOne(() => Student)
  id_student: Student;

  @ManyToOne(() => Subject)
  id_subject: Subject;

  @Column({ type: 'float' })
  grade: number;
}
