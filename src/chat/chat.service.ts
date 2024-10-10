
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from './entities/user.entity';  // Assuming a user entity exists

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(senderId: number, receiverId: number, content: string) {
    const sender = await this.userRepository.findOne(senderId);
    const receiver = await this.userRepository.findOne(receiverId);
    const message = this.messageRepository.create({ sender, receiver, content, timestamp: new Date() });
    return this.messageRepository.save(message);
  }

  async getMessages(userId: number) {
    return this.messageRepository.find({ where: [{ sender: userId }, { receiver: userId }], relations: ['sender', 'receiver'] });
  }
}
