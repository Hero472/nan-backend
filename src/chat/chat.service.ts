// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(createChatMessageDto: CreateChatMessageDto) {
    const newMessage = this.chatRepository.create(createChatMessageDto);
    return this.chatRepository.save(newMessage);
  }

  async getMessages(senderId: string, receiverId: string) {
    return this.chatRepository.find({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: { timestamp: 'ASC' },
    });
  }
}
