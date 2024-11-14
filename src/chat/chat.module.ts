import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
