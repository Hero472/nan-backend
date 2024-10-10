
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(senderId, receiverId, content);
  }

  @Get('messages/:userId')
  getMessages(@Param('userId') userId: number) {
    return this.chatService.getMessages(userId);
  }
}
