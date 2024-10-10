
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';  // Assuming a user entity exists

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('date')
  date: Date;

  @Column()
  type: string;  // e.g., "exam", "meeting", etc.

  @ManyToOne(() => User, (user) => user.events)
  createdBy: User;
}
