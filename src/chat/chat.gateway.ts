import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server | undefined;
  
    constructor(private readonly chatService: ChatService) {}
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    @SubscribeMessage('joinChat')
    handleJoinChat(client: Socket, userId: string) {
      client.join(userId);  // El usuario se une a una sala específica
    }
  
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @MessageBody() data: { message: string; senderId: string; receiverId: string }
    ) {
      const savedMessage = await this.chatService.saveMessage(data);
      console.log('Mensaje guardado:', savedMessage);
      if (this.server) {
        this.server.to(data.receiverId).emit('receiveMessage', savedMessage);
      }
    }
  }
  