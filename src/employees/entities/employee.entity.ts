
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column('decimal')
  salary: number;

  @Column()
  schedule: string;  // Could be refined further if linked to schedule entities

  @Column('date')
  hireDate: Date;
}
