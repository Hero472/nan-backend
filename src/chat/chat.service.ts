import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/chat.entity';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
  ) {}

  async createMessage(
    content: string,
    sender: string,
    room: string,
  ): Promise<Message> {
    console.log("inside service")
    console.log(content)
    console.log(sender)
    console.log(room)
    if (!content || !sender || !room) {
      throw new Error('Invalid message data');
    }

    const newMessage = new this.messageModel({ content, sender, room });
    return newMessage.save();
  }

  async getMessages(room: string): Promise<Message[]> {
    if (!room) {
      throw new Error('Room name is required to fetch messages');
    }

    return this.messageModel.find({ room }).sort({ createdAt: -1 }).exec();
  }

  async getAllRooms(): Promise<string[]> {
    return this.messageModel.distinct('room').exec();
  }
}
