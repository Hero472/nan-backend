
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Parent } from './parent.entity';  // Assuming a parent entity exists

@Entity()
export class RequestComplaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;  // e.g., "request", "complaint"

  @Column()
  description: string;

  @Column('date')
  date: Date;

  @Column()
  status: string;  // e.g., "pending", "resolved"

  @ManyToOne(() => Parent, (parent) => parent.requestsComplaints)
  parent: Parent;
}
