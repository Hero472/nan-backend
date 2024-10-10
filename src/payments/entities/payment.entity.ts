
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';  // Assuming a user entity exists

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column('date')
  paymentDate: Date;

  @Column()
  description: string;

  @Column()
  status: string;  // e.g., "paid", "pending", etc.

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
