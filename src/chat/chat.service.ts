import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async saveMessage(data: { message: string; senderId: string; receiverId: string }) {
    const newMessage = this.messageRepository.create({
      content: data.message,
      senderId: data.senderId,
      receiverId: data.receiverId,
      timestamp: new Date(),
    });
    return await this.messageRepository.save(newMessage);
  }

  async getMessages(senderId: string, receiverId: string) {
    return await this.messageRepository.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: { timestamp: 'ASC' },
    });
  }
}