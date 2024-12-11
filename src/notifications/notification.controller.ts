import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificationService) {}

  @Post('enviar')
  async enviarNotificacionGlobal(@Body() body: { titulo: string; mensaje: string }) {
    return this.notificacionService.enviarNotificacionGlobal(body.titulo, body.mensaje);
  }
}
