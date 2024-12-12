import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Professor } from '../../professor/entities/professor.entity';
import { LevelEnum, DayEnum, BlockEnum } from '../../enum';
import { Grade } from 'src/grade/entities/grade.entity';

@Entity('subject')
export class Subject {
  @PrimaryGeneratedColumn()
  id_subject!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'enum', enum: LevelEnum })
  level!: LevelEnum;

  @Column({ type: 'enum', enum: DayEnum })
  day!: DayEnum;

  @Column({ type: 'enum', enum: BlockEnum })
  block!: BlockEnum;

  @ManyToOne(() => Professor, (professor) => professor.subjects)
  professor!: Professor;

  @OneToMany(() => Grade, (grade) => grade.subject)
  grades!: Grade[];
}
