import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificacionController } from './notification.controller';

@Module({
  providers: [NotificationService],
  controllers: [NotificacionController],
  exports: [NotificationService],  // Exportar para usar en otros módulos
})
export class NotificacionModule {}
