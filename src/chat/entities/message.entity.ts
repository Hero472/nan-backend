import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content: string | undefined;

  @Column()
  senderId: string | undefined;

  @Column()
  receiverId: string | undefined;

  @CreateDateColumn()
  timestamp: Date | undefined;
}