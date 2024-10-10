import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Professor } from '../../professor/entities/professor.entity';
import { LevelEnum, DayEnum, BlockEnum } from '../../enum';

@Entity('subject')
export class Subject {
  @PrimaryGeneratedColumn()
  id_subject!: number;

  @ManyToOne(() => Professor)
  id_professor!: Professor;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'enum', enum: LevelEnum })
  level!: LevelEnum;

  @Column({ type: 'enum', enum: DayEnum })
  day!: DayEnum;

  @Column({ type: 'enum', enum: BlockEnum })
  block!: BlockEnum;
}
