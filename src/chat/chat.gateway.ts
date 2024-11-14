// src/chat/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { senderId, receiverId, message } = data;
    await this.chatService.saveMessage(data);
    this.server.to(receiverId).emit('receiveMessage', { message, senderId });
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    client.join(userId);
  }
}
