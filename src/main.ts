import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configurar Swagger para la documentación de la API
  const options = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation using OpenAPI and NestJS')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Habilitar validaciones globales
  app.useGlobalPipes(new ValidationPipe());

  // Configurar Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  // Escuchar en el puerto definido en las variables de entorno o en el 3000 por defecto
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
