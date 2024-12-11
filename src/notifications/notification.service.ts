import { Injectable,Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly ONE_SIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';
  private readonly APP_ID = '1d4c09bc-73a5-4063-97ee-58a042ecbf21';
  private readonly API_KEY = 'os_v2_app_dvgatpdtuvaghf7olcqef3f7ee3uw76q4b4efh553kkvkpr33hf6qd5qorvnq66cegnrpyctbiq3i3wbondrqcwcbcyztyq5s3nkpry';

  async sendNotification(
    title: string,
    message: string,
    playerIds: string[],
  ): Promise<void> {
    try {
      await axios.post(
        this.ONE_SIGNAL_API_URL,
        {
          app_id: this.APP_ID,
          include_player_ids: playerIds,
          headings: { en: title },
          contents: { en: message },
        },
        {
          headers: {
            Authorization: `Basic ${this.API_KEY}`,
          },
        },
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async enviarNotificacionGlobal(titulo: string, mensaje: string) {
      this.logger.log('Enviando notificación global con título: ' + titulo + ' y mensaje: ' + mensaje);  // Log de los parámetros de entrada
      const response = await axios.post(
        this.ONE_SIGNAL_API_URL,
        {
          app_id: this.APP_ID,
          headings: { en: titulo },  // Título en inglés
          contents: { en: mensaje },  // Contenido en inglés
          included_segments: ['All'], // Enviar a todos los usuarios
        },
        {
          headers: {
            Authorization: `Basic ${this.API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log('Notificación enviada correctamente:', response.data);  // Log de la respuesta de la API
      return response.data;
    } catch (error: any) {
      this.logger.error('Error enviando la notificación global:', error);  // Log detallado de error
      console.error('Error enviando la notificación global:', error);
      throw new Error('No se pudo enviar la notificación');
    }
  }
