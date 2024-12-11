import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody()
    body: {
      event: string;
      data: { content: string; sender: string; room: string };
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { content, sender, room } = body.data;
    console.log('Event:', body.event);
    console.log('Content:', content);
    console.log('Sender:', sender);
    console.log('Room:', room);

    const message = await this.chatService.createMessage(content, sender, room);
    this.server.to(room).emit('newMessage', message);
    console.log(message);
    return message;
  }

  @SubscribeMessage('getMessages')
  async getMessages(@MessageBody() data: { room: string }, @ConnectedSocket() client: Socket) {
    let messages = await this.chatService.getMessages(data.room);
    messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    client.emit('receiveMessages', messages);
    return messages;
  }

  @SubscribeMessage('getAllRooms')
  async getAllRooms( @ConnectedSocket() client: Socket) {
    const rooms = await this.chatService.getAllRooms();
    console.log(rooms);
    client.emit('allRooms', rooms);
    return rooms; // Send back the list of rooms to the client
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received data:', data); // Check if the data has the expected structure
    if (!data || !data.room) {
      throw new Error('Room name is missing or invalid');
    }
    client.join(data.room);
    client.emit('joinedRoom', { room: data.room });
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    client.emit('leftRoom', data.room);
  }
}
