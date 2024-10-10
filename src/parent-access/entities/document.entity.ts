
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';  // Assuming a student entity exists

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filePath: string;  // Path to the document file

  @ManyToOne(() => Student, (student) => student.documents)
  student: Student;
}
