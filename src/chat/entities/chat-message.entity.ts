// src/chat/entities/chat-message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chat_message')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  senderId!: string;

  @Column()
  receiverId!: string;

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp!: Date;
}
