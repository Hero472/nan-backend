import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { IsInt, Max, Min } from 'class-validator';
import { LevelEnum } from 'src/enum';

@Entity('grade')
export class Grade {
  @PrimaryGeneratedColumn()
  id_grade!: number;

  @ManyToOne(() => Student, (student) => student.grades)
  student!: Student;

  @ManyToOne(() => Subject, (subject) => subject.grades)
  subject!: Subject;

  @Column({ type: 'float' })
  @Min(1)
  @Max(7)
  grade!: number;

  @Column({type: 'enum', enum: LevelEnum})
  level!: LevelEnum;

  @Column()
  @IsInt()
  @Min(2000)
  @Max(3000)
  year!: number;
}
