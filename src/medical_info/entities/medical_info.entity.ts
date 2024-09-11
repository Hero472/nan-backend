import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from '../../student/entities/student.entity';

@Entity('medical_info')
export class MedicalInfo {
  @PrimaryGeneratedColumn()
  id_medical_info: number;

  @ManyToOne(() => Student)
  id_student: Student;

  @Column({ type: 'text', nullable: true })
  medical_condition: string;

  @Column({ type: 'text', nullable: true })
  medications: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;
}
